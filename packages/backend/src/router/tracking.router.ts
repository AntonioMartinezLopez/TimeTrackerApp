import { Router } from "express";
import { addTracking, getCorrespondingTrackings, getTracking, getTrackings, patchTracking, removeTracking } from "../controller/tracking.controller";

export const trackingRouter = Router( {mergeParams: true } );

trackingRouter.get('/', getTrackings);
trackingRouter.post('/', addTracking);
trackingRouter.get('/:trackingId', getTracking);
trackingRouter.patch('/:trackingId', patchTracking);
trackingRouter.delete('/:trackingId', removeTracking);
trackingRouter.get('/task/:taskId', getCorrespondingTrackings)