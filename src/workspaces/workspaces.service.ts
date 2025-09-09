import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { User } from '../entities/user.entity';
import { Board } from '../entities/board.entity';
import { List } from '../entities/list.entity';
import { Card } from '../entities/card.entity';
import { AddWorkspaceMemberDto, CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private wsRepo: Repository<Workspace>,
    @InjectRepository(WorkspaceMember) private wmRepo: Repository<WorkspaceMember>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(List) private listRepo: Repository<List>,
    @InjectRepository(Card) private cardRepo: Repository<Card>,
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
    // Versión ligera: solo info básica + boards
    const ws = await this.wsRepo.findOne({ 
      where: { id }, 
      relations: { 
        owner: true,
        members: { user: true },
        boards: true  // Solo boards básicos, sin listas/cartas
      } 
    });
    if (!ws) throw new NotFoundException('Workspace not found');
    return ws;
  }

  async findOneWithFullData(id: number) {
    // Versión completa: para casos específicos
    const ws = await this.wsRepo.findOne({ 
      where: { id }, 
      relations: { 
        owner: true,
        members: { user: true },
        boards: {
          lists: {
            cards: true
          }
        }
      } 
    });
    if (!ws) throw new NotFoundException('Workspace not found');
    return ws;
  }

  async findOneOverview(id: number) {
    // Versión dashboard: stats + info básica
    const ws = await this.wsRepo.findOne({ 
      where: { id }, 
      relations: { owner: true, boards: true }
    });
    if (!ws) throw new NotFoundException('Workspace not found');
    
    // Agregar estadísticas
    const stats = await Promise.all(
      ws.boards.map(async board => ({
        ...board,
        listCount: await this.getListCount(board.id),
        cardCount: await this.getCardCount(board.id)
      }))
    );
    
    return { ...ws, boards: stats };
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

  // Métodos auxiliares para estadísticas
  private async getListCount(boardId: number): Promise<number> {
    return this.listRepo
      .createQueryBuilder('list')
      .innerJoin('list.board', 'board')
      .where('board.id = :boardId', { boardId })
      .getCount();
  }

  private async getCardCount(boardId: number): Promise<number> {
    return this.cardRepo
      .createQueryBuilder('card')
      .innerJoin('card.list', 'list')
      .innerJoin('list.board', 'board')
      .where('board.id = :boardId', { boardId })
      .getCount();
  }
}
