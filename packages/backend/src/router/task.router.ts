import { Router } from "express";
import { addLabels, createTask, deleteTask, getTask, getTasks, patchTask, removeLabels } from "../controller/task.controller";

export const taskRouter = Router( {mergeParams: true });

taskRouter.get('/', getTasks);
taskRouter.post('/', createTask);
taskRouter.get('/:taskId', getTask);
taskRouter.delete('/:taskId', deleteTask);
taskRouter.patch('/:taskId', patchTask);
taskRouter.patch('/:taskId/label', addLabels);
taskRouter.delete('/:taskId/label', removeLabels);
