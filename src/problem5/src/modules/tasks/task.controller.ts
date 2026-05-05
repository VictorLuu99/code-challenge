import type { Request, Response } from 'express';
import { taskService } from './task.service.js';
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
  idParamSchema,
} from './task.schema.js';
import { paginationMeta } from '../../utils/pagination.js';

export const taskController = {
  async create(req: Request, res: Response) {
    const data = createTaskSchema.parse(req.body);
    const task = await taskService.create(data);
    res.status(201).json(task);
  },

  async list(req: Request, res: Response) {
    const query = listTasksSchema.parse(req.query);
    const { data, total } = await taskService.list(query);
    res.json({
      data,
      pagination: paginationMeta(total, { page: query.page, limit: query.limit }),
    });
  },

  async getById(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const task = await taskService.getById(id);
    res.json(task);
  },

  async update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const data = updateTaskSchema.parse(req.body);
    const task = await taskService.update(id, data);
    res.json(task);
  },

  async delete(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await taskService.delete(id);
    res.status(204).send();
  },
};
