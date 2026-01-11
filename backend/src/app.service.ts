import { Inject, Injectable } from '@nestjs/common';
import { DB_TOKEN } from './drizzle/drizzle.module';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';
import { notes } from './db/schema';
import { desc, eq, InferInsertModel } from 'drizzle-orm';
import * as path from 'path';
import * as fs from 'fs/promises';

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
      try {
        await this.deleteFileByPath(note.bannerUrl);
      } catch (err) {
        console.error('Failed to delete banner file:', err);
      }
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

  async deleteFileByPath(filePath: string) {
    if (!filePath.startsWith('/uploads/')) {
      throw new Error('Invalid file path');
    }
    const relativePath = filePath.replace(/^\/+/, '');
    const absolutePath = path.join(process.cwd(), relativePath);
    console.log('Deleting:', absolutePath);
    await fs.unlink(absolutePath);
    return { success: true };
  }
}
