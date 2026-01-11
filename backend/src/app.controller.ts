import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { InferInsertModel } from 'drizzle-orm';
import { notes } from './db/schema';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create-note')
  createNote() {
    return this.appService.createNote();
  }

  @Patch('/:id')
  updateNote(
    @Param('id') id: string,
    @Body() note: Partial<InferInsertModel<typeof notes>>,
  ) {
    return this.appService.updateNote(id, note);
  }

  @Delete('/:id')
  deleteNote(@Param('id') id: string) {
    return this.appService.deleteNote(id);
  }

  @Get()
  getNotes() {
    return this.appService.getAll();
  }

  @Get('/:id')
  getNote(@Param('id') id: string) {
    return this.appService.getNote(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  @Delete('upload/:filename')
  deleteUploadedFile(@Param('filename') filename: string) {
    console.log(filename);
    return this.appService.deleteFile(filename);
  }
}
