import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'crypto';

export const notes = sqliteTable('notes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text('title'),
  content: text('content', { mode: 'json' }),
  emoji: text('emoji'),
  bannerUrl: text('banner_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
