import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsInt()
  @Min(1)
  cardId: number;

  @IsInt()
  @Min(1)
  userId: number;
}
