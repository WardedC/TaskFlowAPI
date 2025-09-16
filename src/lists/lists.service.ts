import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';
import { Board } from '../entities/board.entity';
import { CreateListDto, UpdateListDto } from '../dto/list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private listRepo: Repository<List>,
    @InjectRepository(Board) private boardRepo: Repository<Board>,
  ) {}

  async create(dto: CreateListDto) {
    const board = await this.boardRepo.findOne({ where: { id: dto.boardId } });
    if (!board) throw new NotFoundException('Board not found');
    const list = this.listRepo.create({
      title: dto.title,
      position: dto.position,
      board,
    });
    return this.listRepo.save(list);
  }

  findAll() {
    return this.listRepo.find({ relations: { board: true } });
  }

  async findOne(id: number) {
    const l = await this.listRepo.findOne({
      where: { id },
      relations: { board: true },
    });
    if (!l) throw new NotFoundException('List not found');
    return l;
  }

  async update(id: number, dto: UpdateListDto) {
    const l = await this.findOne(id);
    if (dto.title !== undefined) l.title = dto.title;
    if (dto.position !== undefined) l.position = dto.position;
    return this.listRepo.save(l);
  }

  async remove(id: number) {
    const res = await this.listRepo.delete(id);
    if (!res.affected) throw new NotFoundException('List not found');
  }
}
