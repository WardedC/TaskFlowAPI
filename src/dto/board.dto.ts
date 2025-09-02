import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsInt()
  @Min(1)
  workspaceId: number;
}

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;
}
