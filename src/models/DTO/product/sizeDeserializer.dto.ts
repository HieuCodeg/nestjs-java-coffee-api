import { Injectable } from '@nestjs/common';
import { SizeDTO } from './size.dto';

@Injectable()
export class SizeDTODeserializer {
  deserialize(json: any): SizeDTO[] {
    const sizes: SizeDTO[] = [];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const sizeNode = json[key];
        const name = sizeNode.name;
        const price = sizeNode.price;
        sizes.push(new SizeDTO(name, price));
      }
    }
    return sizes;
  }
}
