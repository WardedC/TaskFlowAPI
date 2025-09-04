import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ example: 'Implement user authentication', description: 'Card title', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({ 
    example: 'Create login/register endpoints with JWT authentication', 
    description: 'Card description', 
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 1, description: 'Position of the card in the list' })
  @IsInt()
  position: number;

  @ApiProperty({ example: 1, description: 'ID of the list this card belongs to' })
  @IsInt()
  @Min(1)
  listId: number;
}

export class UpdateCardDto {
  @ApiProperty({ 
    example: 'Implement user authentication - Updated', 
    description: 'Card title', 
    maxLength: 150, 
    required: false 
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiProperty({ 
    example: 'Updated description with additional requirements', 
    description: 'Card description', 
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 2, description: 'New position of the card in the list', required: false })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({ example: 2, description: 'Move card to different list ID', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  listId?: number;
}

export class AssignUserDto {
  @ApiProperty({ example: 1, description: 'ID of the user to assign to the card' })
  @IsInt()
  @Min(1)
  userId: number;
}
