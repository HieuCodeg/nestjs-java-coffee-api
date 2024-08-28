import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { ProductImageDTO } from '../DTO/productImage/productImage.dto';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_name', nullable: true })
  fileName: string;

  @Column({ name: 'file_folder', nullable: true })
  fileFolder: string;

  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;

  @Column({ name: 'file_type', nullable: true })
  fileType: string;

  @Column({ name: 'cloud_id', nullable: true })
  cloudId: string;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  width: number;

  @Column({ type: 'bigint', default: () => '0' })
  ts: number = new Date().getTime();

  toProductImageDTO(): ProductImageDTO {
    return {
      id: this.id,
      fileName: this.fileName,
      fileFolder: this.fileFolder,
      fileUrl: this.fileUrl,
      fileType: this.fileType,
      cloudId: this.cloudId,
      height: String(this.height),
      width: String(this.width),
      ts: this.ts,
    } as ProductImageDTO;
  }
}
