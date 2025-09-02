import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { User } from '../entities/user.entity';
import { AddWorkspaceMemberDto, CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private wsRepo: Repository<Workspace>,
    @InjectRepository(WorkspaceMember) private wmRepo: Repository<WorkspaceMember>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateWorkspaceDto) {
    const owner = await this.userRepo.findOne({ where: { id: dto.ownerId } });
    if (!owner) throw new NotFoundException('Owner not found');
    const ws = this.wsRepo.create({ name: dto.name, owner });
    const saved = await this.wsRepo.save(ws);
    // owner as member with role 'owner'
    await this.wmRepo.save(this.wmRepo.create({ workspace: saved, user: owner, role: 'owner' }));
    return saved;
  }

  findAll() {
    return this.wsRepo.find({ relations: { owner: true } });
  }

  async findOne(id: number) {
    const ws = await this.wsRepo.findOne({ where: { id }, relations: { owner: true, members: { user: true } } });
    if (!ws) throw new NotFoundException('Workspace not found');
    return ws;
  }

  async update(id: number, dto: UpdateWorkspaceDto) {
    const ws = await this.findOne(id);
    if (dto.name !== undefined) ws.name = dto.name;
    return this.wsRepo.save(ws);
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
    return this.wmRepo.save(this.wmRepo.create({ workspace: ws, user, role: dto.role }));
  }

  async removeMember(id: number, memberId: number) {
    const res = await this.wmRepo.delete(memberId);
    if (!res.affected) throw new NotFoundException('Member not found');
  }
}
