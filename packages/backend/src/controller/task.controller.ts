import { validate } from "class-validator";
import { Request, Response } from "express";
import { getConnection, getRepository, Repository } from "typeorm";
import { Label } from "../entity/label.entity";
import { Task } from "../entity/task.entity";
import { manageLabels } from "./task.controller.helper";

export const getTasks = async (_: Request, res: Response) => {
  const taskRepository: Repository<Task> = getRepository(Task);

  const tasks = await taskRepository.find();

  return res.send({
    data: tasks,
  });
};

export const createTask = async (req: Request, res: Response) => {
  const { name, description, labels } = req.body;

  const typedLabels = labels as Label[];

  let dbLabels: Label[] = [];

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    if (labels) {
      const promiseTags = await manageLabels(typedLabels, queryRunner);
      dbLabels = promiseTags.filter((label) => label !== undefined) as Label[];
    }

    const task = new Task();
    task.name = name;
    task.description = description;
    task.labels = dbLabels;

    //Check instance of Label
    const errors = await validate(task);
    if (errors.length > 0) {
      res.status(400).send({ errors });
      return;
    }

    const taskRepository: Repository<Task> = queryRunner.manager.getRepository(
      Task
    );
    const createdTask: Task = await taskRepository.save(task);
    await queryRunner.commitTransaction();

    return res.send({ data: createdTask });
  } catch (e) {
    await queryRunner.rollbackTransaction();
    return res.status(500).send(JSON.stringify(e));
  } finally {
    await queryRunner.release();
  }
};

export const getTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const taskRepository = await getRepository(Task);

  try {
    const task = await taskRepository.findOneOrFail(taskId);
    return res.send({
      data: task,
    });
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const taskRepository = await getRepository(Task);

  try {
    const task = await taskRepository.findOneOrFail(taskId);
    await taskRepository.remove(task);
    res.send({});
  } catch (e) {
    res.status(404).send({
      status: "not_found",
    });
  }
};

export const patchTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const { name, description, labels } = req.body;

  const typedLabels = labels as Label[];

  let dbLabels: Label[] = [];

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    if (labels) {
      const promiseTags = await manageLabels(typedLabels, queryRunner);
      dbLabels = promiseTags.filter((label) => label !== undefined) as Label[];
    }

    const taskRepository: Repository<Task> = queryRunner.manager.getRepository(
      Task
    );
    let task = await taskRepository.findOneOrFail(taskId);

    task.name = name;
    task.description = description;
    task.labels = dbLabels;

    task = await taskRepository.save(task);
    await queryRunner.commitTransaction();
    return res.send({
      data: task,
    });
  } catch (e) {
    await queryRunner.rollbackTransaction();
    return res.status(404).send({
      status: e,
    });
  } finally {
    await queryRunner.release();
  }
};

export const addLabels = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const labels = req.body.labels;

  const typedLabels = labels as Label[];
  let dbLabels: Label[] = [];

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    if (labels) {
      const promiseTags = await manageLabels(typedLabels, queryRunner);
      dbLabels = promiseTags.filter((label) => label !== undefined) as Label[];
    } else {
      return res.status(400).send({ message: "empty body" });
    }

    const taskRepository: Repository<Task> = queryRunner.manager.getRepository(
      Task
    );
    let task = await taskRepository.findOneOrFail(taskId);

    dbLabels.forEach((label) => {
      task.labels.push(label);
    });

    const updatedTask = await taskRepository.save(task);
    await queryRunner.commitTransaction();

    return res.send({ data: updatedTask });
  } catch (e) {
    await queryRunner.rollbackTransaction();

    return res.status(500).send(JSON.stringify(e));
  } finally {
    await queryRunner.release();
  }
};

export const removeLabels = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const labels = req.body.labels;
  const typedLabels = labels as Label[];

  const taskRepository = getRepository(Task);

  try {
    if (typedLabels) {
      let task = await taskRepository.findOneOrFail(taskId);

      typedLabels.forEach((typedLabel) => {
        task.labels = task.labels.filter((label) => {
          return label.id !== typedLabel.id;
        });
      });

      const updatedTask = await taskRepository.save(task);

      return res.send({ data: updatedTask });
    } else {
      return res.status(400).send({ message: "empty body" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send(JSON.stringify(e));
  }
};

interface times {
  id: string;
  name: string;
  time: number;
  numberTrackings: number;
}

export const calculateMeanTimes = async (_: Request, res: Response) => {
  const taskRepository: Repository<Task> = await getRepository(Task);

  const tasks = await taskRepository.find();

  let totalTimes: times[] = [];
  tasks.forEach((task) => {
    let totalTaskTime: number = 0;
    let numOfTrackings: number = 0;
    task.trackings.forEach((tracking) => {
      const startTime: Date = new Date(tracking.startTime);
      const endTime: Date = new Date(tracking.endTime);

      totalTaskTime += endTime.getTime() - startTime.getTime();
      numOfTrackings += 1;
    });


    totalTimes.push({
      id: task.id,
      name: task.name,
      time: totalTaskTime,
      numberTrackings: numOfTrackings
    });
  });

  return res.send({
    data: totalTimes,
  });
};
