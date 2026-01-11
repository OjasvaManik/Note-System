import { Inject, Injectable } from '@nestjs/common';
import { DB_TOKEN } from './drizzle/drizzle.module';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';
import { notes } from './db/schema';
import { desc, eq, InferInsertModel } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor(
    @Inject(DB_TOKEN) private db: BetterSQLite3Database<typeof schema>,
  ) {}

  async createNote() {
    const [note] = await this.db
      .insert(notes)
      .values({
        title: 'Untitled',
        content: [],
      })
      .returning({ id: notes.id });

    return note;
  }

  async updateNote(id: string, data: Partial<InferInsertModel<typeof notes>>) {
    await this.db.update(notes).set(data).where(eq(notes.id, id));
  }

  async deleteNote(id: string) {
    const note = await this.getNote(id);
    if (note?.bannerUrl?.startsWith('/uploads/')) {
      const filename = note.bannerUrl.replace('/uploads/', '');
      this.deleteFile(filename);
    }
    await this.db.delete(notes).where(eq(notes.id, id)).execute();
  }

  async getNote(id: string) {
    return this.db.query.notes.findFirst({
      where: eq(notes.id, id),
    });
  }

  async getAll() {
    return this.db.query.notes.findMany({
      orderBy: [desc(notes.updatedAt)],
    });
  }

  deleteFile(filename: string) {
    try {
      const safeFilename = path.basename(filename);
      const filePath = path.join(process.cwd(), 'uploads', safeFilename);

      console.log('Deleting:', filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted successfully');
      } else {
        console.warn('File not found');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
}
