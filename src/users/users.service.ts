import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto.js';
import * as crypto from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      passwordHash: this.hash(dto.password),
      profileImageUrl: dto.profileImageUrl ?? null,
    });
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password !== undefined) user.passwordHash = this.hash(dto.password);
    if (dto.profileImageUrl !== undefined) user.profileImageUrl = dto.profileImageUrl;
    return this.repo.save(user);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('User not found');
  }

  private hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}
