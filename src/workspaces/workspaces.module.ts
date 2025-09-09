import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { User } from '../entities/user.entity';
import { Board } from '../entities/board.entity';
import { List } from '../entities/list.entity';
import { Card } from '../entities/card.entity';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Workspace, WorkspaceMember, User, Board, List, Card])],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})

export class WorkspacesModule {


}
