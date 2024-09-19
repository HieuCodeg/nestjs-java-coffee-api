import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AppUtils } from 'src/common/app.untils';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { TableDTO } from 'src/models/DTO/table/table.dto';
import { TableCreateDTO } from 'src/models/DTO/table/tableCreate.dto';
import { TableUpdateDTO } from 'src/models/DTO/table/tableUpdate.dto';
import { CTable } from 'src/models/entities/cTable.entity';
import { EnumOrderStatus } from 'src/models/enums/enumOrderStatus';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';
import { DatabaseCheckServiceImpl } from 'src/services/database-check.service';
import { OrderItemService } from 'src/services/order-item.service';
import { OrderService } from 'src/services/order.service';
import { TableService } from 'src/services/table.service';

@UseGuards(JwtAuthGuard)
@Controller('api/tables')
export class TableController {
  constructor(
    private readonly tableService: TableService,
    private readonly databaseCheckService: DatabaseCheckServiceImpl,
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly appUtils: AppUtils,
  ) {}

  @Get()
  async getAllByDeletedIsFalse(): Promise<TableDTO[]> {
    const tableDTOS = await this.tableService.getAllTableWhereDeletedIsFalse();

    if (tableDTOS.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return tableDTOS;
  }

  @Get('status/:status')
  async getTablesByStatus(
    @Param('status') status: string,
  ): Promise<TableDTO[]> {
    const tableDTOS = await this.tableService.getTablesWhereStatus(
      EnumTableStatus[status],
    );

    if (tableDTOS.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return tableDTOS;
  }

  @Get('cashier/:tableId')
  async getTableWithOrderById(@Param('tableId') tableId: number): Promise<any> {
    const table = await this.tableService.findById(tableId);

    if (!table) {
      throw new HttpException('Bàn không tồn tại!', HttpStatus.NOT_FOUND);
    }

    const orderDTOList =
      await this.orderService.getOrderDTOByTableIdAndOrderStatus(
        tableId,
        EnumOrderStatus.UNPAID,
      );

    if (orderDTOList.length === 0) {
      throw new HttpException('Bàn chưa có hóa đơn', HttpStatus.NOT_FOUND);
    }

    const orderResponseDTO = {
      orderId: orderDTOList[0].id,
      tableId: tableId,
      totalAmount: orderDTOList[0].totalAmount,
      staffId: orderDTOList[0].staff.id,
      orderItems: await this.orderItemService.getOrderItemResponseDTOByOrderId(
        orderDTOList[0].id,
      ),
    };

    return orderResponseDTO;
  }

  @Get(':tableId')
  async getTableById(@Param('tableId') tableId: number): Promise<TableDTO> {
    const table = await this.tableService.findById(tableId);

    if (!table) {
      throw new HttpException('Bàn không tồn tại!', HttpStatus.NOT_FOUND);
    }

    return table.toTableDTO();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTable(
    @Body(new ValidationPipe()) tableCreateDTO: TableCreateDTO,
  ): Promise<TableDTO> {
    if (await this.tableService.existByName(tableCreateDTO.name)) {
      throw new HttpException(
        'Bàn đã tồn tại trong hệ thống.',
        HttpStatus.BAD_REQUEST,
      );
    }
    let table = new CTable();
    table.id = null;
    table.name = tableCreateDTO.name;
    table.status = EnumTableStatus.EMPTY;
    table = await this.tableService.save(table);

    await this.databaseCheckService.updateWithTableCheck();

    return table.toTableDTO();
  }

  @Patch(':tableId')
  @UseGuards(JwtAuthGuard)
  async updateTable(
    @Param('tableId') tableId: number,
    @Body(new ValidationPipe()) tableUpdateDTO: TableUpdateDTO,
  ): Promise<TableDTO> {
    const table = await this.tableService.findById(tableId);

    if (!table) {
      throw new HttpException('Bàn không tồn tại!', HttpStatus.NOT_FOUND);
    }

    if (
      await this.tableService.existByNameAndIdIsNot(
        tableUpdateDTO.name,
        tableUpdateDTO.id,
      )
    ) {
      throw new HttpException('Table already exists', HttpStatus.BAD_REQUEST);
    }

    const oldStatus = table.status;
    const newStatus = EnumTableStatus[tableUpdateDTO.status];

    if (oldStatus === newStatus) {
      throw new HttpException(
        `Table is currently ${oldStatus}, cannot change status.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (oldStatus === EnumTableStatus.OPEN) {
      const orderDTOList =
        await this.orderService.getOrderDTOByTableIdAndOrderStatus(
          tableId,
          EnumOrderStatus.UNPAID,
        );
      if (orderDTOList.length > 0) {
        throw new HttpException(
          'Table has unpaid orders, cannot close table.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    table.name = tableUpdateDTO.name;
    table.status = newStatus;

    await this.tableService.save(table);

    return table.toTableDTO();
  }

  @Patch('update/:tableId')
  @UseGuards(JwtAuthGuard)
  async updateTableNoStatus(
    @Param('tableId') tableId: number,
    @Body(new ValidationPipe()) tableUpdateDTO: TableUpdateDTO,
  ): Promise<TableDTO> {
    console.log('tableUpdateDTO', tableUpdateDTO);
    const table = await this.tableService.findById(tableId);

    if (!table) {
      throw new HttpException('Bàn không tồn tại!', HttpStatus.NOT_FOUND);
    }

    if (
      await this.tableService.existByNameAndIdIsNot(
        tableUpdateDTO.name,
        tableUpdateDTO.id,
      )
    ) {
      throw new HttpException('Table already exists', HttpStatus.BAD_REQUEST);
    }

    table.name = tableUpdateDTO.name;

    await this.tableService.save(table);

    await this.databaseCheckService.updateWithTableCheck();

    return table.toTableDTO();
  }

  @Delete('delete/:tableId')
  @UseGuards(JwtAuthGuard)
  async deleteTable(@Param('tableId') tableId: number): Promise<void> {
    const table = await this.tableService.findById(tableId);

    if (!table) {
      throw new HttpException('Bàn không tồn tại!', HttpStatus.NOT_FOUND);
    }

    try {
      await this.tableService.softDelete(tableId);
      await this.databaseCheckService.updateWithTableCheck();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'An error occurred. Please contact the administrator.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
