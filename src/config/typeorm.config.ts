import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { Workspace } from '../entities/workspace.entity.js';
import { WorkspaceMember } from '../entities/workspace-member.entity.js';
import { Board } from '../entities/board.entity.js';
import { List } from '../entities/list.entity.js';
import { Card } from '../entities/card.entity.js';
import { CardAssignee } from '../entities/card-assignee.entity.js';
import { Comment } from '../entities/comment.entity.js';

export default registerAs(
  'database',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'taskflow',
    synchronize: (process.env.DB_SYNC || 'true') === 'true',
    logging: false,
    entities: [User, Workspace, WorkspaceMember, Board, List, Card, CardAssignee, Comment],
  }),
);
