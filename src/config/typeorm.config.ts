import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { Board } from '../entities/board.entity';
import { List } from '../entities/list.entity';
import { Card } from '../entities/card.entity';
import { CardAssignee } from '../entities/card-assignee.entity';
import { Comment } from '../entities/comment.entity';

export default registerAs(
  'database',
  (): DataSourceOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: (process.env.DB_SYNC || 'true') === 'true',
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [User, Workspace, WorkspaceMember, Board, List, Card, CardAssignee, Comment],
  }),
);
