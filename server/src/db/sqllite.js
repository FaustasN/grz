import Database from 'better-sqlite3'; 
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
const saltRounds = 10;

dotenv.config();
const db = new Database('reservations.db');
const username = "admin";
const password = await bcrypt.hash("adm1n", saltRounds);

// Enable foreign keys
db.pragma('foreign_keys = ON');
// Automatiškai sukuria lentelę, jei jos dar nėra
db.prepare(`
  CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          reservation_date TEXT NOT NULL,
          service_type TEXT NOT NULL,
          additional_info TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          reminder_sent INTEGER DEFAULT 0
      );
`).run();
db.prepare(`
    CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
        
  `).run();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            caption TEXT,
            photo_url TEXT NOT NULL,
            photo_type TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
  `).run();
  db.prepare(`
  INSERT OR IGNORE INTO admin (username, password)
        VALUES (?, ?);
  `).run(username, password);

export default db;

