import { Router } from "express";
import { addLabel, removeLabel, getCorrespondingTasks, getLabel, getLabels, patchLabel } from "../controller/label.controller";

export const labelRouter = Router( {mergeParams: true });

labelRouter.get('/', getLabels);
labelRouter.post('/', addLabel);
labelRouter.get('/:labelId', getLabel);
labelRouter.patch('/:labelId', patchLabel);
labelRouter.delete('/:labelId', removeLabel);
labelRouter.get('/:labelId/tasks', getCorrespondingTasks);
