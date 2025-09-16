import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceMember } from './workspace-member.entity';
import { TaskAssignee } from './task-assignee.entity';
import { Comment } from './comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'profile_image_url', type: 'text', nullable: true })
  profileImageUrl?: string | null;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: string; // 'admin' | 'user'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Workspace, (ws) => ws.owner)
  workspacesOwned: Workspace[];

  @OneToMany(() => WorkspaceMember, (wm) => wm.user)
  workspaceMemberships: WorkspaceMember[];

  @OneToMany(() => TaskAssignee, (ta) => ta.user)
  assignedTasks: TaskAssignee[];

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];
}
