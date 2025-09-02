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
import { CardAssignee } from './card-assignee.entity';
import { Comment } from './comment.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column()
  position: number;

  @ManyToOne(() => List, (l) => l.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: List;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CardAssignee, (a) => a.card)
  assignees: CardAssignee[];

  @OneToMany(() => Comment, (c) => c.card)
  comments: Comment[];
}
