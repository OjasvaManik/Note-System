import { Inject, Injectable } from '@nestjs/common';
import { DB_TOKEN } from './drizzle/drizzle.module';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';
import { notes } from './db/schema';
import { desc, eq, InferInsertModel } from 'drizzle-orm';

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
        // Initialize with an empty array for BlockNote (valid JSON) rather than empty string
        content: [],
      })
      // Pass the column you want to return here
      .returning({ id: notes.id });

    return note;
  }

  async updateNote(id: string, data: Partial<InferInsertModel<typeof notes>>) {
    await this.db.update(notes).set(data).where(eq(notes.id, id));
  }

  async deleteNote(id: string) {
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
}
