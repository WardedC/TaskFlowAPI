import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('task_assignees')
export class TaskAssignee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (t) => t.assignees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, (u) => u.assignedTasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
