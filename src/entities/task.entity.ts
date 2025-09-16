import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JoinColumn } from 'typeorm';
import { List } from './list.entity';
import { TaskAssignee } from './task-assignee.entity';
import { Comment } from './comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column()
  position: number;

  @Column({ name: 'task_status', type: 'boolean', default: false })
  taskStatus: boolean;

  @ManyToOne(() => List, (l) => l.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: List;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TaskAssignee, (a) => a.task)
  assignees: TaskAssignee[];

  @OneToMany(() => Comment, (c) => c.task)
  comments: Comment[];
}
