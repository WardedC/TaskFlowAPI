import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entities/card.entity';
import { List } from '../entities/list.entity';
import { CardAssignee } from '../entities/card-assignee.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { AssignUserDto, CreateCardDto, UpdateCardDto } from '../dto/card.dto';
import { CreateCommentDto } from '../dto/comment.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private cardRepo: Repository<Card>,
    @InjectRepository(List) private listRepo: Repository<List>,
    @InjectRepository(CardAssignee) private assigneeRepo: Repository<CardAssignee>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async create(dto: CreateCardDto) {
    const list = await this.listRepo.findOne({ where: { id: dto.listId } });
    if (!list) throw new NotFoundException('List not found');
    const card = this.cardRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      position: dto.position,
      list,
    });
    return this.cardRepo.save(card);
  }

  findAll() {
    return this.cardRepo.find({ relations: { list: true } });
  }

  async findOne(id: number) {
    const c = await this.cardRepo.findOne({
      where: { id },
      relations: { list: true, assignees: { user: true }, comments: { user: true } },
    });
    if (!c) throw new NotFoundException('Card not found');
    return c;
  }

  async update(id: number, dto: UpdateCardDto) {
    const c = await this.findOne(id);
    if (dto.title !== undefined) c.title = dto.title;
    if (dto.description !== undefined) c.description = dto.description;
    if (dto.position !== undefined) c.position = dto.position;
    if (dto.listId !== undefined) {
      const list = await this.listRepo.findOne({ where: { id: dto.listId } });
      if (!list) throw new NotFoundException('List not found');
      c.list = list;
    }
    return this.cardRepo.save(c);
  }

  async remove(id: number) {
    const res = await this.cardRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Card not found');
  }

  async assignUser(cardId: number, dto: AssignUserDto) {
    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.assigneeRepo.save(this.assigneeRepo.create({ card, user }));
  }

  async unassignUser(cardId: number, assigneeId: number) {
    const res = await this.assigneeRepo.delete(assigneeId);
    if (!res.affected) throw new NotFoundException('Assignee not found');
  }

  async addComment(dto: CreateCommentDto) {
    const card = await this.cardRepo.findOne({ where: { id: dto.cardId } });
    if (!card) throw new NotFoundException('Card not found');
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.commentRepo.save(this.commentRepo.create({ content: dto.content, card, user }));
  }
}
