import { Module } from '@nestjs/common';
import { AppUtils } from 'src/common/app.untils';
import { CloudinaryUploadUtil } from 'src/common/cloudinary.utils';
import { EmailUtil } from 'src/common/email.untils';
import { JsonToMapConverter } from 'src/common/json.to.map';

@Module({
  imports: [],
  providers: [AppUtils, CloudinaryUploadUtil, EmailUtil, JsonToMapConverter],
  exports: [AppUtils, CloudinaryUploadUtil, EmailUtil, JsonToMapConverter],
})
export class UntilModule {}
