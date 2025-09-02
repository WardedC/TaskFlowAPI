import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsInt()
  @Min(1)
  ownerId: number;
}

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;
}

export class AddWorkspaceMemberDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  @MaxLength(50)
  role: string;
}
