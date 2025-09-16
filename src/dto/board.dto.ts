import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
