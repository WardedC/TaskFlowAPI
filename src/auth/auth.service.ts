import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { LoginDto, RegisterDto, AuthResponseDto, DeleteAccountDto } from './dto/auth.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Crear usuario usando el servicio de usuarios
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    return {
      message: 'Usuario registrado exitosamente',
      userId: user.id,
      userName: user.name,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // Buscar usuario por email
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña usando el método del UsersService
    const isPasswordValid = await this.usersService.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      message: 'Login exitoso',
      userId: user.id,
      userName: user.name,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  /**
   * Elimina la cuenta del usuario después de verificar su contraseña
   * IMPORTANTE: Esto eliminará TODOS los datos relacionados (workspaces, boards, cards, etc.)
   */
  async deleteAccount(userId: number, dto: DeleteAccountDto): Promise<{ message: string }> {
    // 1. Buscar el usuario
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
        
      throw new NotFoundException('Usuario no encontrado');

    }

    // 2. Verificar contraseña actual
    const isPasswordValid = await this.usersService.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 3. Eliminar el usuario (esto también eliminará datos relacionados por CASCADE)
    await this.userRepo.delete(userId);

    return {
      message: 'Cuenta eliminada exitosamente. Esperamos verte de nuevo en el futuro.',
    };
  }
}
