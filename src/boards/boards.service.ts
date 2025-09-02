import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { Workspace } from '../entities/workspace.entity';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(Workspace) private wsRepo: Repository<Workspace>,
  ) {}

  async create(dto: CreateBoardDto) {
    const workspace = await this.wsRepo.findOne({ where: { id: dto.workspaceId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    const board = this.boardRepo.create({ title: dto.title, workspace });
    return this.boardRepo.save(board);
  }

  findAll() {
    return this.boardRepo.find({ relations: { workspace: true } });
  }

  async findOne(id: number) {
    const b = await this.boardRepo.findOne({ where: { id }, relations: { workspace: true } });
    if (!b) throw new NotFoundException('Board not found');
    return b;
  }

  async update(id: number, dto: UpdateBoardDto) {
    const b = await this.findOne(id);
    if (dto.title !== undefined) b.title = dto.title;
    return this.boardRepo.save(b);
  }

  async remove(id: number) {
    const res = await this.boardRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Board not found');
  }
}
