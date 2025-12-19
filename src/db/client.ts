import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expoDb = openDatabaseSync('75hard.db');
export const db = drizzle(expoDb, { schema });

// Initialization logic (simple migration for now)
export const initDB = async () => {
    // In a real prod app with Drizzle, we might use drizzle-kit,
    // but for true offline local init without external calls, we can auto-create tables via raw SQL or drizzle-kit generate.
    // For this 'Constraints' environment, I will run a raw CREATE TABLE query to ensure tables exist if migrations fail/aren't setup.
    // Drizzle is great for query type safety, but init is easier with SQL here.
    
    await expoDb.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS days (
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'locked',
        notes TEXT
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        value TEXT,
        FOREIGN KEY(day_id) REFERENCES days(id)
      );
      CREATE TABLE IF NOT EXISTS custom_todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(day_id) REFERENCES days(id)
      );
      CREATE TABLE IF NOT EXISTS todo_subtasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(todo_id) REFERENCES custom_todos(id) ON DELETE CASCADE
      );
    `);
    
    // Check if we need to seed the 75 days? 
    // Maybe better to seed on demand or lazily, but let's check one.
    const firstDay = await db.query.days.findFirst();
    if (!firstDay) {
       console.log("Seeding Database...");
       // Logic to Seed 75 days will go here in a service
    }
    console.log("DB Initialized");
};
