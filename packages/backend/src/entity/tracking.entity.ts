import { IsNotEmpty, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Tracking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString()
  description: string;

  @Column({ default: null })
  startTime: string;

  @Column({ default: null })
  endTime: string;

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;

  @ManyToOne(() => Task, (task) => task.trackings, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @IsNotEmpty()
  task: Task;
}
