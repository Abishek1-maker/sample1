import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Param,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadservice: UploadService) {}

  // ─── UPLOAD MULTIPLE ──────────────────────────
  @ApiOperation({ summary: ' upload multiples images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post(':userId')
  @UseInterceptors(FilesInterceptor('files', 5))
  uploadFiles(
    @Param('userId') userId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.uploadservice.uploadFiles(userId, files);
  }
  // ─── DELETE ONE IMAGE ──────────────────────────
  @ApiOperation({ summary: 'Delete one image by imageId' })
  @Delete(':imageId')
  deleteFile(@Param('imageId') imageId: number) {
    return this.uploadservice.deleteFile(+imageId);
  }

  // ─── DELETE ALL IMAGES OF USER ─────────────────
  @ApiOperation({ summary: 'Delete all images of a user' })
  @Delete('all/:userId')
  deleteAllFiles(@Param('userId') userId: number) {
    return this.uploadservice.deleteAllFiles(+userId);
  }
}
