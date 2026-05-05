import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { taskController } from './task.controller.js';

export const taskRoutes = Router();

taskRoutes.post('/', asyncHandler(taskController.create));
taskRoutes.get('/', asyncHandler(taskController.list));
taskRoutes.get('/:id', asyncHandler(taskController.getById));
taskRoutes.patch('/:id', asyncHandler(taskController.update));
taskRoutes.delete('/:id', asyncHandler(taskController.delete));
