import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@email.com',
    maxLength: 150
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario',
    example: 'miContraseñaSegura123',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiPropertyOptional({ 
    description: 'URL de la imagen de perfil del usuario',
    example: 'https://ejemplo.com/imagen.jpg'
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string | null;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    description: 'Nombre completo del usuario',
    example: 'Juan Carlos Pérez',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Correo electrónico del usuario',
    example: 'juan.carlos@email.com',
    maxLength: 150
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Nueva contraseña del usuario',
    example: 'nuevaContraseña456',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string;

  @ApiPropertyOptional({ 
    description: 'URL de la imagen de perfil del usuario',
    example: 'https://ejemplo.com/nueva-imagen.jpg'
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string | null;
}
