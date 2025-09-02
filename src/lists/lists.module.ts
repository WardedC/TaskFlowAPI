import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from '../entities/list.entity';
import { Board } from '../entities/board.entity';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([List, Board])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
