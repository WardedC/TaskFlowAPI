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

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'cover_url', type: 'text', nullable: true })
  cover?: string | null;

  @Column({ length: 80, default: 'indigo' })
  theme: string;

  @Column({ name: 'theme_color', length: 20, default: '#4F46E5' })
  themeColor: string;

  @Column({ name: 'icon', type: 'varchar', length: 100, nullable: true })
  icon?: string | null;


  @Column({ name: 'tasks_total', type: 'int', default: 0 })
  tasksTotal: number;

  @Column({ name: 'tasks_completed', type: 'int', default: 0 })
  tasksCompleted: number;

  @Column({ name: 'tasks_pending', type: 'int', default: 0 })
  tasksPending: number;

  @Column({ name: 'is_favorite', type: 'boolean', default: false })
  isFavorite: boolean;

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
