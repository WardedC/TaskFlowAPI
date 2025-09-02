import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { Workspace } from '../entities/workspace.entity';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Workspace])],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class BoardsModule {}
