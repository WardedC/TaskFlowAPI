import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';
import { Task } from './task.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column()
  position: number;

  @ManyToOne(() => Board, (b) => b.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Task, (t) => t.list)
  tasks: Task[];
}
