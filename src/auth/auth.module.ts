import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { User } from '../entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule, // Importamos UsersModule para usar UsersService
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Exportamos para usar en otros módulos si es necesario
})
export class AuthModule {}
