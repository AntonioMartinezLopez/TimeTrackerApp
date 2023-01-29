import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Label } from "../entity/label.entity";

export const getLabels = async (_: Request, res: Response) => {
  const labelRepository: Repository<Label> = getRepository(Label);

  const labels = await labelRepository.find();

  return res.send({
    data: labels,
  });
};

export const addLabel = async (req: Request, res: Response) => {
  const { name } = req.body;

  if(!name){
    return res.status(400).send({
      status: "no label name",
    });
  }

  //check for name duplication
  const labelRepository: Repository<Label> = getRepository(Label);
  const counter = await labelRepository.findOne({where: {name : name},});

  if(counter){
    return res.status(400).send({
      status: 'label name duplication',
    });
  };

  const newLabel = new Label();
  newLabel.name = name;

  

  const savedLabel = await labelRepository.save(newLabel);

  return res.send({
    data: savedLabel,
  });
};

export const getLabel = async (req: Request, res: Response) => {
  const labelId = req.params.id;
  const labelRepository: Repository<Label> = getRepository(Label);

  try {
    const label = await labelRepository.findOneOrFail(labelId);
    return res.send({
      data: label,
    });
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};

export const patchLabel = async (req: Request, res: Response) => {
  const labelId = req.params.id;
  const { name } = req.body;

  const labelRepository: Repository<Label> = getRepository(Label);

  try {
    const label = await labelRepository.findOneOrFail(labelId);
    label.name = name;

    const savedModel = await labelRepository.save(label);
    return res.send({
      data: savedModel,
    });
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};

export const removeLabel = async (req: Request, res: Response) => {
  const labelId = req.params.id;
  const labelRepository: Repository<Label> = getRepository(Label);

  try {
    const label = await labelRepository.findOneOrFail(labelId);
    await labelRepository.remove(label);
    return res.send({});
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};

export const getCorrespondingTasks = async (req: Request, res: Response) => {
  const labelId = req.params.id;
  const labelRepository: Repository<Label> = getRepository(Label);

  try {
    const label = await labelRepository.findOneOrFail(labelId);

    const labels: Label[] = await labelRepository
      .createQueryBuilder("label")
      .leftJoinAndSelect("label.tasks", "tasks")
      .where("label.id=:id", { id: label.id })
      .getMany();


    return res.send({
      data: labels,
    });
  } catch (e) {
    return res.status(404).send({
      status: "not found",
    });
  }
};
