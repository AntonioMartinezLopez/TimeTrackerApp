import { IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Label {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    name: string;

    @CreateDateColumn()
    createdAt: string;
  
    @CreateDateColumn()
    updatedAt: string;

    @ManyToMany(() => Task, (task) => task.labels, {nullable: true})
    tasks: Task[];
}