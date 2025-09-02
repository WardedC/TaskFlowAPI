import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../entities/card.entity';
import { List } from '../entities/list.entity';
import { CardAssignee } from '../entities/card-assignee.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List, CardAssignee, User, Comment])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
