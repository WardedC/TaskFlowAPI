import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { List } from '../entities/list.entity';
import { TaskAssignee } from '../entities/task-assignee.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Board } from '../entities/board.entity';
import { Workspace } from '../entities/workspace.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, List, TaskAssignee, User, Comment, Board, Workspace])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
