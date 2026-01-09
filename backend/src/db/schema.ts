import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'crypto'; // Built-in Node module

export const notes = sqliteTable('notes', {
  // Change to text and use $defaultFn to auto-generate
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  title: text('title'),
  content: text('content', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
