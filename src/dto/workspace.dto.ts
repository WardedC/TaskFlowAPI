import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({
    description: 'Nombre del espacio de trabajo',
    example: 'Mi Proyecto Personal',
    maxLength: 150
  })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'ID del usuario propietario del espacio de trabajo',
    example: 1,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  ownerId: number;
}

export class UpdateWorkspaceDto {
  @ApiPropertyOptional({
    description: 'Nuevo nombre del espacio de trabajo',
    example: 'Proyecto Actualizado',
    maxLength: 150
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;
}

export class AddWorkspaceMemberDto {
  @ApiProperty({
    description: 'ID del usuario a agregar como miembro',
    example: 2,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    description: 'Rol del miembro en el espacio de trabajo',
    example: 'member',
    enum: ['owner', 'admin', 'member', 'viewer'],
    maxLength: 50
  })
  @IsString()
  @MaxLength(50)
  role: string;
}
