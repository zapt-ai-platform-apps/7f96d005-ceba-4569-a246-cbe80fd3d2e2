CREATE TABLE "tasks" (
  "id" SERIAL PRIMARY KEY,
  "task_description" TEXT NOT NULL,
  "priority" TEXT,
  "project" TEXT,
  "due_date" DATE,
  "status" TEXT,
  "owner" TEXT,
  "company" TEXT,
  "user_id" UUID NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);