import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JsonToMapConverter {
  private static readonly logger = new Logger(JsonToMapConverter.name);

  static convertToDatabaseColumn(attribute: string): Record<string, any> {
    if (!attribute) {
      return {};
    }
    try {
      return JSON.parse(attribute) as Record<string, any>;
    } catch (e) {
      this.logger.error(
        'Convert error while trying to convert string(JSON) to map data structure.',
        e.stack,
      );
      return {};
    }
  }

  static convertToEntityAttribute(dbData: Record<string, any>): string | null {
    try {
      return JSON.stringify(dbData);
    } catch (e) {
      this.logger.error('Could not convert map to json string.', e.stack);
      return null;
    }
  }
}
