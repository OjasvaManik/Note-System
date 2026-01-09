import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';

export const DB_TOKEN = 'DB_TOKEN';

@Global() // Makes it available everywhere without re-importing
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      useFactory: () => {
        const sqlite = new Database('sqlite.db');
        return drizzle(sqlite, { schema });
      },
    },
  ],
  exports: [DB_TOKEN],
})
export class DrizzleModule {}
