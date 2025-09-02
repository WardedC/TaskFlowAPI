import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsInt()
  position: number;

  @IsInt()
  @Min(1)
  listId: number;
}

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  listId?: number;
}

export class AssignUserDto {
  @IsInt()
  @Min(1)
  userId: number;
}
