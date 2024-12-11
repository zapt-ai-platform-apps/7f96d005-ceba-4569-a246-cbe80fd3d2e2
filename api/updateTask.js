import { tasks } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { and, eq } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'PUT') {
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    const {
      id,
      taskDescription,
      priority,
      project,
      dueDate,
      status,
      owner,
      company,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const sql = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(sql);

    let formattedDueDate = null;
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid due date' });
      }
      formattedDueDate = parsedDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }

    await db
      .update(tasks)
      .set({
        taskDescription,
        priority,
        project,
        dueDate: formattedDueDate,
        status,
        owner,
        company,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)));

    res.status(200).json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error updating task:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error updating task' });
    }
  }
}