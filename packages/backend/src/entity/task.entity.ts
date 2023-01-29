import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, IsString } from 'class-validator';
import { Tracking } from "./tracking.entity";
import { Label } from "./label.entity";


@Entity()
export class Task {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsString()
    description: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToMany(() => Tracking, tracking => tracking.task, {
        eager: true,
        cascade: true
    })
    trackings: Tracking[];

    @ManyToMany(() => Label, (label) => label.tasks, {
        cascade: true,
        eager: true
    })
    @JoinTable({ name: 'task_labels' })
    labels: Label[];
}