import { pgTable, serial, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';

export const jokes = pgTable('jokes', {
  id: serial('id').primaryKey(),
  setup: text('setup').notNull(),
  punchline: text('punchline').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  taskDescription: text('task_description').notNull(),
  priority: text('priority'),
  project: text('project'),
  dueDate: date('due_date'),
  status: text('status'),
  owner: text('owner'),
  company: text('company'),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});