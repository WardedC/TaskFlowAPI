import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateListDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsInt()
  position: number;

  @IsInt()
  @Min(1)
  boardId: number;
}

export class UpdateListDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
