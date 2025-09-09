import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, AuthResponseDto, DeleteAccountDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }


    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    // No emitimos token en registro
    return {
      message: 'Usuario registrado exitosamente',
      userId: user.id,
      userName: user.name,
      role: user.role,
    } as AuthResponseDto;
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    //const user busca el usuario por email
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // isPasswordValid valida contraseña usando el método del UsersService
    const isPasswordValid = await this.usersService.verifyPassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generamos token para cualquier rol (usuario o admin)
    const accessToken = await this.signToken(user);
    return {
      message: 'Login exitoso',
      userId: user.id,
      userName: user.name,
      role: user.role,
      accessToken,
    } as AuthResponseDto;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  private async signToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwt.signAsync(payload);
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
