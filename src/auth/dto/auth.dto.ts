import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'miPassword123', description: 'Contraseña del usuario' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'miPassword123', description: 'Contraseña del usuario', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class DeleteAccountDto {
  @ApiProperty({ 
    example: 'miPassword123', 
    description: 'Contraseña actual para confirmar eliminación de cuenta' 
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'Login exitoso', description: 'Mensaje de respuesta' })
  message: string;

  @ApiProperty({ example: 1, description: 'ID del usuario autenticado' })
  userId: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario' })
  userName: string;

  @ApiProperty({ example: 'user', description: 'Rol del usuario (user/admin)' })
  role: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT de acceso (solo se emite para admin en login)' })
  accessToken?: string;
}
