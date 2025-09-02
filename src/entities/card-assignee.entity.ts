import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './card.entity';
import { User } from './user.entity';

@Entity('card_assignees')
export class CardAssignee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card, (c) => c.assignees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @ManyToOne(() => User, (u) => u.assignedCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
