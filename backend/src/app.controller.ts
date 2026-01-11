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
import * as path from 'path';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import { videoToGif } from './ffmpeg.util';

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
        destination: './tmp',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const isVideo = file.mimetype.startsWith('video/');
    const filename = file.filename;

    if (!isVideo) {
      const finalPath = path.join('uploads/images', filename);
      await fs.rename(file.path, finalPath);

      return { url: `/uploads/images/${filename}` };
    }
    const gifName = `${path.parse(filename).name}.gif`;
    const gifPath = path.join('uploads/gifs', gifName);

    await videoToGif(file.path, gifPath);

    await fs.unlink(file.path).catch(() => {});
    await fs.unlink(`${file.path}.palette.png`).catch(() => {});
    return { url: `/uploads/gifs/${gifName}` };
  }

  @Delete('upload/file')
  deleteUploadedFile(@Body('path') filePath: string) {
    console.log('Deleting:', filePath);
    return this.appService.deleteFileByPath(filePath);
  }
}
