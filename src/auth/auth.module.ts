import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { MeController } from './me.controller';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module';
import { User } from '../entities/user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN') || '7d' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule, // Importamos UsersModule para usar UsersService
  ],
  controllers: [AuthController, MeController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Exportamos para usar en otros módulos si es necesario
})
export class AuthModule {}
