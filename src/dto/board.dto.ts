import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class BoardTasksDto {
  @ApiProperty({ description: 'Total de tareas asociadas al tablero', example: 19, minimum: 0 })
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

export class CreateBoardDto {
  @ApiProperty({
    description: 'Título del tablero',
    example: 'Desarrollo de la App Móvil',
    maxLength: 150,
  })
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'ID del espacio de trabajo donde se creará el tablero',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  workspaceId: number;

  @ApiPropertyOptional({
    description: 'Contadores de tareas iniciales para el tablero',
    type: BoardTasksDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BoardTasksDto)
  tasks?: BoardTasksDto;
}

export class UpdateBoardDto {
  @ApiPropertyOptional({
    description: 'Nuevo título del tablero',
    example: 'Desarrollo de la App Web',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({
    description: 'Actualizar contadores de tareas del tablero',
    type: BoardTasksDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BoardTasksDto)
  tasks?: BoardTasksDto;
}
