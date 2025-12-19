import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const days = sqliteTable('days', {
  id: integer('id').primaryKey(), // 1 to 75
  date: text('date').notNull(), // ISO Date String (YYYY-MM-DD)
  status: text('status', { enum: ['locked', 'active', 'completed', 'failed'] }).default('locked'),
  notes: text('notes'),
});

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  dayId: integer('day_id').references(() => days.id).notNull(),
  type: text('type', { 
    enum: ['workout_outdoor', 'workout_indoor', 'water', 'read', 'diet', 'pic', 'no_alcohol'] 
  }).notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  value: text('value'), // Store details (e.g. "Ran 5k", "Read Chapter 1")
});

export const customTodos = sqliteTable('custom_todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  dayId: integer('day_id').references(() => days.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed', { mode: 'boolean' }).default(false),
});

export const todoSubtasks = sqliteTable('todo_subtasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  todoId: integer('todo_id').references(() => customTodos.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
});
