import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/client.js';
import { AppError } from '../../utils/AppError.js';
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from './task.schema.js';

export const taskService = {
  async create(input: CreateTaskInput) {
    return prisma.task.create({ data: input });
  },

  async list(query: ListTasksQuery) {
    const where: Prisma.TaskWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.q) where.title = { contains: query.q, mode: 'insensitive' };
    if (query.dueBefore) where.dueDate = { lte: query.dueBefore };

    const [field, direction] = query.sort.split(':') as [string, 'asc' | 'desc'];

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { [field]: direction },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.task.count({ where }),
    ]);

    return { data, total };
  },

  async getById(id: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new AppError(404, 'Task not found');
    return task;
  },

  async update(id: string, input: UpdateTaskInput) {
    try {
      return await prisma.task.update({ where: { id }, data: input });
    } catch (err) {
      if ((err as { code?: string }).code === 'P2025') {
        throw new AppError(404, 'Task not found');
      }
      throw err;
    }
  },

  async delete(id: string) {
    try {
      await prisma.task.delete({ where: { id } });
    } catch (err) {
      if ((err as { code?: string }).code === 'P2025') {
        throw new AppError(404, 'Task not found');
      }
      throw err;
    }
  },
};
