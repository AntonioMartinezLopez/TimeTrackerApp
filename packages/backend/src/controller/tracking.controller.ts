import { validate } from "class-validator";
import { Request, Response } from "express";
import { getConnection, getRepository, Repository, SelectQueryBuilder } from "typeorm";
//import { Task } from "../entity/task.entity";
import { Tracking } from "../entity/tracking.entity";

export const getTrackings = async (_: Request, res: Response) => {
  const trackingRepository: Repository<Tracking> = getRepository(Tracking);

  const tasks = await trackingRepository.find();

  return res.send({
    data: tasks,
  });
};

export const addTracking = async (req: Request, res: Response) => {
  const { description, startTime, endTime, taskId } = req.body;

  const newTracking = new Tracking();
  newTracking.description = description;
  newTracking.task = taskId;
  newTracking.startTime = startTime;
  newTracking.endTime = endTime;

  const errors = await validate(newTracking);
  if (errors.length > 0) {
    return res.status(400).send({ errors });
  }

  try {
    const trackingRepository: Repository<Tracking> = getRepository(Tracking);

    const savedTracking = await trackingRepository.save(newTracking);

    return res.send({
      data: savedTracking,
    });
  } catch (e) {
    return res.status(404).send({
      status: "task_not_found",
    });
  }
};

export const getTracking = async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const trackingRepository: Repository<Tracking> = getRepository(Tracking);

  try {
    const tracking = await trackingRepository.findOneOrFail(trackingId);

    return res.send({
      data: tracking,
    });
  } catch (e) {
    return res.status(404).send({
      status: e,
    });
  }
};

export const removeTracking = async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const trackingRepository: Repository<Tracking> = getRepository(Tracking);
  

  try {
    const tracking = await trackingRepository.findOneOrFail(trackingId);
    await getConnection().createQueryBuilder().delete().from(Tracking).where("description = :desc", {desc: tracking.description}).execute();
    return res.send({});
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};

export const patchTracking = async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const { description, startTime, endTime, taskId } = req.body;

  const trackingRepository: Repository<Tracking> = getRepository(Tracking);

  try {
    const tracking = await trackingRepository.findOneOrFail(trackingId);
    tracking.description = description;
    tracking.task = taskId;
    tracking.startTime = startTime;
    tracking.endTime = endTime;

    const savedTracking = await trackingRepository.save(tracking);
    return res.send({
      data: savedTracking,
    });
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};

export const getCorrespondingTrackings = async (
  req: Request,
  res: Response
) => {
  const taskId: string = req.params.taskId;
  console.log(taskId);

  const trackingRepository: Repository<Tracking> = getRepository(Tracking);

  try {
    const trackings = await trackingRepository.find({
      join: { alias: "tracking", leftJoinAndSelect: { task: "tracking.task" } },
      where: (qb: SelectQueryBuilder<Tracking>) => {
        qb.where("task.id = :id", { id: taskId });
      },
      order: { description: "ASC", startTime: "ASC" },
    });

    return res.send({
      data: trackings,
    });
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};
