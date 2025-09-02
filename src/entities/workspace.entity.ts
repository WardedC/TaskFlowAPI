import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { WorkspaceMember } from './workspace-member.entity';
import { Board } from './board.entity';
import { JoinColumn } from 'typeorm';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @ManyToOne(() => User, (u) => u.workspacesOwned, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WorkspaceMember, (wm) => wm.workspace)
  members: WorkspaceMember[];

  @OneToMany(() => Board, (b) => b.workspace)
  boards: Board[];
}
