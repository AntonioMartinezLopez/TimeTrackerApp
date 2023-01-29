import { EntityManager, QueryRunner } from "typeorm";
import { Label } from "../entity/label.entity";

/**a We re doing a upsert via code here
 * Code copied and modified from backend lecture, owner: Daniel Wohlfarth
 */
export const checkExisting = async (labelName: string, manager: EntityManager) => {
  const existingTag = await manager.getRepository(Label).findOne({
    where: { name: labelName },
  });
  const newLabel = new Label();
  newLabel.name = labelName;

  return existingTag || manager.save(newLabel);
};


/*Manages sent label: searches for already existing ones and generates new ones if not found
returns an array of ready to use labels*/ 
export const manageLabels = async (typedLabels: Label[], queryRunner: QueryRunner) => {
    const promiseTags = await Promise.all(
        typedLabels.reduce<Promise<Label | undefined>[]>((prev, label) => {
          if (label.id) {
            prev.push(
              queryRunner.manager.getRepository(Label).findOne(label.id)
            );
            return prev;
          }
          if (label.name) {
            prev.push(checkExisting(label.name, queryRunner.manager));
            
            return prev;
          }
          return prev;
        }, []));
    return promiseTags;
}