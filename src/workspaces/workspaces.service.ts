import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { User } from '../entities/user.entity';
import { List } from '../entities/list.entity';
import { Task } from '../entities/task.entity';
import {
  AddWorkspaceMemberDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from '../dto/workspace.dto';

export type WorkspaceSummary = {
  workspaceId: number;
  id: string;
  title: string;
  desc: string;
  cover: string;
  theme: string;
  themeColor: string;
  icon: string;
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
  members: number;
  boards: number;
  isFavorite: boolean;
};

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private wsRepo: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private wmRepo: Repository<WorkspaceMember>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(List) private listRepo: Repository<List>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateWorkspaceDto) {
    const owner = await this.userRepo.findOne({ where: { id: dto.ownerId } });
    if (!owner) throw new NotFoundException('Owner not found');

    const title = dto.title.trim();
    const slugCandidate = this.generateSlug(dto.slug?.trim() ?? title);
    const slug = await this.ensureUniqueSlug(slugCandidate);

    const ws = this.wsRepo.create({
      name: title,
      slug,
      owner,
      description: dto.desc ?? null,
      cover: dto.cover ?? null,
      theme: dto.theme ?? 'indigo',
      themeColor: dto.themeColor ?? '#4F46E5',
      icon: dto.icon ?? null,tasksTotal: dto.tasks?.total ?? 0,
      tasksCompleted: dto.tasks?.completed ?? 0,
      tasksPending: dto.tasks?.pending ?? 0,
      isFavorite: dto.isFavorite ?? false,
    });

    const saved = await this.wsRepo.save(ws);
    await this.wmRepo.save(
      this.wmRepo.create({ workspace: saved, user: owner, role: 'owner' }),
    );

    return this.findOne(saved.id);
  }

  async findAll(): Promise<WorkspaceSummary[]> {
    const workspaces = await this.wsRepo.find({
      relations: { boards: true, members: true },
      order: { updatedAt: 'DESC' },
    });

    return workspaces.map((ws) => this.presentWorkspace(ws));
  }

  async findOne(id: number) {
    const workspace = await this.wsRepo.findOne({
      where: { id },
      relations: {
        owner: true,
        members: { user: true },
        boards: true,
      },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');

    const summary = this.presentWorkspace(workspace);
    return {
      ...summary,
      owner: workspace.owner
        ? {
            id: workspace.owner.id,
            name: workspace.owner.name,
            email: workspace.owner.email,
          }
        : null,
      membersDetail:
        workspace.members?.map((member) => ({
          id: member.id,
          role: member.role,
          userId: member.user?.id ?? null,
          userName: member.user?.name ?? null,
          userEmail: member.user?.email ?? null,
        })) ?? [],
      boardsDetail:
        workspace.boards?.map((board) => ({
          id: board.id,
          title: board.title,
        })) ?? [],
    };
  }

  async findOneWithFullData(id: number) {
    const workspace = await this.wsRepo.findOne({
      where: { id },
      relations: {
        owner: true,
        members: { user: true },
        boards: {
          lists: {
            tasks: true,
          },
        },
      },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');

    const summary = this.presentWorkspace(workspace);
    return {
      ...summary,
      owner: workspace.owner
        ? {
            id: workspace.owner.id,
            name: workspace.owner.name,
            email: workspace.owner.email,
          }
        : null,
      membersDetail:
        workspace.members?.map((member) => ({
          id: member.id,
          role: member.role,
          userId: member.user?.id ?? null,
          userName: member.user?.name ?? null,
          userEmail: member.user?.email ?? null,
        })) ?? [],
      boardTrees:
        workspace.boards?.map((board) => ({
          id: board.id,
          title: board.title,
          lists:
            board.lists?.map((list) => ({
              id: list.id,
              title: list.title,
              position: list.position,
              tasks:
                list.tasks?.map((task) => ({
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  position: task.position,
                  taskStatus: task.taskStatus,
                })) ?? [],
            })) ?? [],
        })) ?? [],
    };
  }

  async findOneOverview(id: number) {
    const workspace = await this.wsRepo.findOne({
      where: { id },
      relations: { owner: true, boards: true },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');

    const summary = this.presentWorkspace(workspace);
    const stats = await Promise.all(
      workspace.boards.map(async (board) => ({
        id: board.id,
        title: board.title,
        listCount: await this.getListCount(board.id),
        taskCount: await this.getTaskCount(board.id),
      })),
    );

    return {
      ...summary,
      owner: workspace.owner
        ? {
            id: workspace.owner.id,
            name: workspace.owner.name,
            email: workspace.owner.email,
          }
        : null,
      boardStats: stats,
    };
  }

  async update(id: number, dto: UpdateWorkspaceDto) {
    const workspace = await this.wsRepo.findOne({ where: { id } });
    if (!workspace) throw new NotFoundException('Workspace not found');

    if (dto.title !== undefined) {
      workspace.name = dto.title.trim();
    }
    if (dto.desc !== undefined) {
      workspace.description = dto.desc ?? null;
    }
    if (dto.cover !== undefined) {
      workspace.cover = dto.cover ?? null;
    }
    if (dto.theme !== undefined) {
      workspace.theme = dto.theme;
    }
    if (dto.themeColor !== undefined) {
      workspace.themeColor = dto.themeColor;
    }
    if (dto.icon !== undefined) {
      workspace.icon = dto.icon ?? null;
    }    if (dto.tasks) {
      workspace.tasksTotal = dto.tasks.total;
      workspace.tasksCompleted = dto.tasks.completed;
      workspace.tasksPending = dto.tasks.pending;
    }
    if (dto.isFavorite !== undefined) {
      workspace.isFavorite = dto.isFavorite;
    }

    await this.wsRepo.save(workspace);
    return this.findOne(id);
  }

  async remove(id: number) {
    const res = await this.wsRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Workspace not found');
  }

  async addMember(id: number, dto: AddWorkspaceMemberDto) {
    const ws = await this.wsRepo.findOne({ where: { id } });
    if (!ws) throw new NotFoundException('Workspace not found');
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.wmRepo.save(
      this.wmRepo.create({ workspace: ws, user, role: dto.role }),
    );
  }

  async removeMember(id: number, memberId: number) {
    const res = await this.wmRepo.delete(memberId);
    if (!res.affected) throw new NotFoundException('Member not found');
  }

  private async getListCount(boardId: number): Promise<number> {
    return this.listRepo
      .createQueryBuilder('list')
      .innerJoin('list.board', 'board')
      .where('board.id = :boardId', { boardId })
      .getCount();
  }

  private async getTaskCount(boardId: number): Promise<number> {
    return this.taskRepo
      .createQueryBuilder('task')
      .innerJoin('task.list', 'list')
      .innerJoin('list.board', 'board')
      .where('board.id = :boardId', { boardId })
      .getCount();
  }

  private presentWorkspace(workspace: Workspace): WorkspaceSummary {
    const members = workspace.members?.length ?? 0;
    const boards = workspace.boards?.length ?? 0;
    const total = workspace.tasksTotal ?? 0;
    const completed = workspace.tasksCompleted ?? 0;
    const pending = workspace.tasksPending ?? Math.max(0, total - completed);

    return {
      workspaceId: workspace.id,
      id: workspace.slug || `ws-${workspace.id}`,
      title: workspace.name,
      desc: workspace.description ?? '',
      cover: workspace.cover ?? '/assets/FlowTask.png',
      theme: workspace.theme ?? 'indigo',
      themeColor: workspace.themeColor ?? '#4F46E5',
      icon: workspace.icon ?? 'fas fa-layer-group',
      tasks: {
        total,
        completed,
        pending,
      },
      members,
      boards,
      isFavorite: workspace.isFavorite ?? false,
    };
  }
  private generateSlug(title: string): string {
    const normalized = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (!normalized) {
      return `ws-${Date.now()}`;
    }
    return normalized.startsWith('ws-') ? normalized : `ws-${normalized}`;
  }

  private async ensureUniqueSlug(
    baseSlug: string,
    excludeId?: number,
  ): Promise<string> {
    let candidate = baseSlug;
    let suffix = 1;
    while (true) {
      const existing = await this.wsRepo.findOne({
        where: { slug: candidate },
      });
      if (!existing || existing.id === excludeId) break;
      candidate = `${baseSlug}-${suffix++}`;
    }
    return candidate;
  }
}
