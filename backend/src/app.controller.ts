import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

  // =========================================================
  // 1. STATIC ROUTES (Must be defined BEFORE dynamic /:id)
  // =========================================================

  @Get('search-images')
  searchImages(@Query('q') query: string, @Query('page') page: string) {
    if (!query) return [];
    return this.appService.searchImages(query, parseInt(page) || 1);
  }

  @Post('track-download')
  trackDownload(@Body('downloadLocation') downloadLocation: string) {
    return this.appService.trackDownload(downloadLocation);
  }

  @Post('/create-note')
  createNote() {
    return this.appService.createNote();
  }

  @Get()
  getNotes() {
    return this.appService.getAll();
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

  // =========================================================
  // 2. DYNAMIC ROUTES (Must be defined LAST)
  // =========================================================

  @Get('/:id')
  getNote(@Param('id') id: string) {
    return this.appService.getNote(id);
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
}
