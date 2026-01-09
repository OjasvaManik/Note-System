import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { InferInsertModel } from 'drizzle-orm';
import { notes } from './db/schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create-note')
  createNote() {
    return this.appService.createNote();
  }

  // Use PATCH for updates (standard convention), though POST works too
  @Patch('/:id')
  updateNote(
    @Param('id') id: string,
    // CRITICAL FIX: Add @Body() to read the JSON data
    @Body() note: Partial<InferInsertModel<typeof notes>>,
  ) {
    // FIX: Use the 'id' from the URL, not from the body
    return this.appService.updateNote(id, note);
  }

  // Use DELETE for deletions
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
}
