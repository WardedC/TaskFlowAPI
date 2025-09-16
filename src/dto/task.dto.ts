import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Task title',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'Create login/register endpoints with JWT authentication',
    description: 'Task description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 1, description: 'Position of the task in the list' })
  @IsInt()
  position: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the list this task belongs to',
  })
  @IsInt()
  @Min(1)
  listId: number;

  @ApiProperty({
    example: false,
    description: 'Task status: false for pending, true for completed',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  taskStatus?: boolean;
}

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication - Updated',
    description: 'Task title',
    maxLength: 150,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiProperty({
    example: 'Updated description with additional requirements',
    description: 'Task description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    example: 2,
    description: 'New position of the task in the list',
    required: false,
  })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({
    example: 2,
    description: 'Move task to different list ID',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  listId?: number;

  @ApiProperty({
    example: true,
    description: 'Update task status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  taskStatus?: boolean;
}

export class AssignUserDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user to assign to the task',
  })
  @IsInt()
  @Min(1)
  userId: number;
}
