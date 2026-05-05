import { z } from 'zod';

const status = z.enum(['todo', 'in_progress', 'done']);
const priority = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: status.optional(),
  priority: priority.optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' });

export const listTasksSchema = z.object({
  status: status.optional(),
  priority: priority.optional(),
  q: z.string().trim().min(1).max(200).optional(),
  dueBefore: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .string()
    .regex(/^(createdAt|updatedAt|dueDate|priority|status):(asc|desc)$/)
    .default('createdAt:desc'),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksSchema>;
