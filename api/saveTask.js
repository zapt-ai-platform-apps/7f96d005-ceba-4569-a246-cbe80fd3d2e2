import { tasks } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    const {
      taskDescription,
      priority,
      project,
      dueDate,
      status,
      owner,
      company,
    } = req.body;

    if (!taskDescription) {
      return res.status(400).json({ error: 'Task description is required' });
    }

    const sql = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(sql);

    const parsedDueDate = dueDate ? new Date(dueDate) : null;
    if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ error: 'Invalid due date' });
    }

    const result = await db
      .insert(tasks)
      .values({
        taskDescription,
        priority,
        project,
        dueDate: parsedDueDate,
        status,
        owner,
        company,
        userId: user.id,
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error saving task:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error saving task' });
    }
  }
}