import { IsInt, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ 
    example: 'This looks good! Please review the authentication logic.', 
    description: 'Comment content' 
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 1, description: 'ID of the card this comment belongs to' })
  @IsInt()
  @Min(1)
  cardId: number;

  @ApiProperty({ example: 1, description: 'ID of the user creating the comment' })
  @IsInt()
  @Min(1)
  userId: number;
}
