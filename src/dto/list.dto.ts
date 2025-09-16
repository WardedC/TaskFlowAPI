import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty({
    description: 'Título de la lista',
    example: 'Por hacer',
    maxLength: 150,
  })
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'Posición de la lista en el tablero (orden)',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  position: number;

  @ApiProperty({
    description: 'ID del tablero donde se creará la lista',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  boardId: number;
}

export class UpdateListDto {
  @ApiPropertyOptional({
    description: 'Nuevo título de la lista',
    example: 'Completadas',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({
    description: 'Nueva posición de la lista en el tablero',
    example: 2,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  position?: number;
}
