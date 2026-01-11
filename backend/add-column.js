const Database = require('better-sqlite3');

// Point this to your actual DB file.
const db = new Database('sqlite.db');

console.log('Running migration...');

// 1. Add Emoji Column
try {
  db.prepare('ALTER TABLE notes ADD COLUMN emoji text').run();
  console.log('✅ Added emoji column');
} catch (error) {
  // If it fails, it usually means the column already exists
  console.log('ℹ️  Emoji column skipped (probably already exists)');
}

// 2. Add Banner URL Column
try {
  db.prepare('ALTER TABLE notes ADD COLUMN banner_url text').run();
  console.log('✅ Added banner_url column');
} catch (error) {
  console.log('ℹ️  Banner URL column skipped (probably already exists)');
}

console.log('Done.');
