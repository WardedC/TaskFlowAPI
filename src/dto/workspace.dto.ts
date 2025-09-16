import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
  IsHexColor,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceTasksDto {
  @ApiProperty({ description: 'Total de tareas asociadas al workspace', example: 19, minimum: 0 })
  @IsInt()
  @Min(0)
  total: number;

  @ApiProperty({ description: 'Tareas completadas', example: 15, minimum: 0 })
  @IsInt()
  @Min(0)
  completed: number;

  @ApiProperty({ description: 'Tareas pendientes', example: 4, minimum: 0 })
  @IsInt()
  @Min(0)
  pending: number;
}

export class CreateWorkspaceDto {
  @ApiProperty({ description: 'Título visible del workspace', example: 'Marketing', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({ description: 'ID del usuario propietario del workspace', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  ownerId: number;

  @ApiPropertyOptional({ description: 'Identificador legible o slug del workspace', example: 'ws-marketing', maxLength: 180 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  slug?: string;

  @ApiPropertyOptional({ description: 'Descripción corta que verá el usuario', example: 'Campañas, contenidos y calendario social.' })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiPropertyOptional({ description: 'Imagen de portada mostrada en el frontend', example: '/assets/FlowTask.png' })
  @IsOptional()
  @IsString()
  cover?: string;

  @ApiPropertyOptional({ description: 'Tema visual usado en el frontend', example: 'amber' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ description: 'Color hexadecimal asociado al tema', example: '#FFB400' })
  @IsOptional()
  @IsHexColor()
  themeColor?: string;

  @ApiPropertyOptional({ description: 'Icono FontAwesome (o equivalente) que representa al workspace', example: 'fas fa-bullhorn' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Resumen de tareas del workspace', type: WorkspaceTasksDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkspaceTasksDto)
  tasks?: WorkspaceTasksDto;

  @ApiPropertyOptional({ description: 'Marca como favorito para accesos rápidos', example: true })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}

export class UpdateWorkspaceDto {
  @ApiPropertyOptional({ description: 'Nuevo título del workspace', example: 'Marketing - Q2', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción visible del workspace', example: 'Campañas y contenidos actualizados.' })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiPropertyOptional({ description: 'Imagen de portada del workspace', example: '/assets/FlowTask.png' })
  @IsOptional()
  @IsString()
  cover?: string;

  @ApiPropertyOptional({ description: 'Tema visual usado en el frontend', example: 'teal' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ description: 'Color hexadecimal asociado al tema', example: '#0FB9B1' })
  @IsOptional()
  @IsHexColor()
  themeColor?: string;

  @ApiPropertyOptional({ description: 'Icono que representa al workspace', example: 'fas fa-paint-brush' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Actualizar totales de tareas', type: WorkspaceTasksDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkspaceTasksDto)
  tasks?: WorkspaceTasksDto;

  @ApiPropertyOptional({ description: 'Marcar/Desmarcar como favorito', example: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}

export class AddWorkspaceMemberDto {
  @ApiProperty({ description: 'ID del usuario a agregar como miembro', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ description: 'Rol del miembro en el espacio de trabajo', example: 'member', enum: ['owner', 'admin', 'member', 'viewer'], maxLength: 50 })
  @IsString()
  @MaxLength(50)
  role: string;
}
