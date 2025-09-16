import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  /**s
   * Hash password using BCrypt with salt rounds of 12
   * More secure than SHA-256: includes automatic salt, slow by design
   */
  private async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 12; // 4,096 iterations - good balance of security vs performance
    return bcrypt.hash(plainPassword, saltRounds);
  }

  /**
   * Verify password against stored hash (for future login functionality)
   */
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      passwordHash: await this.hashPassword(dto.password),
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
    if (dto.password !== undefined)
      user.passwordHash = await this.hashPassword(dto.password);
    if (dto.profileImageUrl !== undefined)
      user.profileImageUrl = dto.profileImageUrl;
    return this.repo.save(user);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('User not found');
  }
}
