import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { List } from '../entities/list.entity';
import { TaskAssignee } from '../entities/task-assignee.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, List, TaskAssignee, User, Comment])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
