import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { List } from '../entities/list.entity';
import { TaskAssignee } from '../entities/task-assignee.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Board } from '../entities/board.entity';
import { Workspace } from '../entities/workspace.entity';
import { AssignUserDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { CreateCommentDto } from '../dto/comment.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(List) private listRepo: Repository<List>,
    @InjectRepository(TaskAssignee)
    private assigneeRepo: Repository<TaskAssignee>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(Workspace) private workspaceRepo: Repository<Workspace>,
  ) {}

  async create(dto: CreateTaskDto) {
    const list = await this.listRepo.findOne({ where: { id: dto.listId } });
    if (!list) throw new NotFoundException('List not found');
    
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      position: dto.position,
      taskStatus: dto.taskStatus ?? false,
      list,
    });
    
    const savedTask = await this.taskRepo.save(task);
    
    // Actualizar contadores automáticamente
    await this.updateCountersForTaskCreation(dto.listId);
    
    return savedTask;
  }

  findAll() {
    return this.taskRepo.find({ relations: { list: true } });
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: {
        list: true,
        assignees: { user: true },
        comments: { user: true },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    const oldStatus = task.taskStatus;
    
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.position !== undefined) task.position = dto.position;
    if (dto.taskStatus !== undefined) task.taskStatus = dto.taskStatus;
    if (dto.listId !== undefined) {
      const list = await this.listRepo.findOne({ where: { id: dto.listId } });
      if (!list) throw new NotFoundException('List not found');
      task.list = list;
    }
    
    const savedTask = await this.taskRepo.save(task);
    
    // Si cambió el status, actualizar contadores
    if (dto.taskStatus !== undefined) {
      await this.updateCountersForTaskStatusChange(
        task.list.id,
        oldStatus,
        dto.taskStatus
      );
    }
    
    return savedTask;
  }

  async toggleStatus(id: number) {
    const task = await this.findOne(id);
    const oldStatus = task.taskStatus;
    const newStatus = !oldStatus;
    
    task.taskStatus = newStatus;
    const savedTask = await this.taskRepo.save(task);
    
    // Actualizar contadores automáticamente
    await this.updateCountersForTaskStatusChange(
      task.list.id,
      oldStatus,
      newStatus
    );
    
    return savedTask;
  }

  async remove(id: number) {
    // Actualizar contadores antes de eliminar
    await this.updateCountersForTaskDeletion(id);
    
    const res = await this.taskRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Task not found');
  }

  async assignUser(taskId: number, dto: AssignUserDto) {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.assigneeRepo.save(this.assigneeRepo.create({ task, user }));
  }

  async unassignUser(taskId: number, assigneeId: number) {
    const res = await this.assigneeRepo.delete(assigneeId);
    if (!res.affected) throw new NotFoundException('Assignee not found');
  }

  async addComment(dto: CreateCommentDto) {
    const task = await this.taskRepo.findOne({ where: { id: dto.taskId } });
    if (!task) throw new NotFoundException('Task not found');
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.commentRepo.save(
      this.commentRepo.create({ content: dto.content, task, user }),
    );
  }

  // Métodos helper para actualizar contadores
  private async updateCountersForTaskCreation(listId: number) {
    // Obtener el board a través de la lista
    const list = await this.listRepo.findOne({
      where: { id: listId },
      relations: { board: { workspace: true } },
    });
    
    if (!list) return;

    // Actualizar contadores del board
    await this.boardRepo.increment(
      { id: list.board.id },
      'tasksTotal',
      1
    );
    await this.boardRepo.increment(
      { id: list.board.id },
      'tasksPending',
      1
    );

    // Actualizar contadores del workspace
    await this.workspaceRepo.increment(
      { id: list.board.workspace.id },
      'tasksTotal',
      1
    );
    await this.workspaceRepo.increment(
      { id: list.board.workspace.id },
      'tasksPending',
      1
    );
  }

  private async updateCountersForTaskStatusChange(
    listId: number,
    oldStatus: boolean,
    newStatus: boolean
  ) {
    if (oldStatus === newStatus) return;

    // Obtener el board a través de la lista
    const list = await this.listRepo.findOne({
      where: { id: listId },
      relations: { board: { workspace: true } },
    });
    
    if (!list) return;

    const boardId = list.board.id;
    const workspaceId = list.board.workspace.id;

    if (newStatus === true) {
      // Task completada: incrementar completed, decrementar pending
      await this.boardRepo.increment({ id: boardId }, 'tasksCompleted', 1);
      await this.boardRepo.decrement({ id: boardId }, 'tasksPending', 1);
      
      await this.workspaceRepo.increment({ id: workspaceId }, 'tasksCompleted', 1);
      await this.workspaceRepo.decrement({ id: workspaceId }, 'tasksPending', 1);
    } else {
      // Task incompleta: decrementar completed, incrementar pending
      await this.boardRepo.decrement({ id: boardId }, 'tasksCompleted', 1);
      await this.boardRepo.increment({ id: boardId }, 'tasksPending', 1);
      
      await this.workspaceRepo.decrement({ id: workspaceId }, 'tasksCompleted', 1);
      await this.workspaceRepo.increment({ id: workspaceId }, 'tasksPending', 1);
    }
  }

  private async updateCountersForTaskDeletion(taskId: number) {
    // Obtener la task con sus relaciones antes de eliminarla
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: { list: { board: { workspace: true } } },
    });
    
    if (!task) return;

    const boardId = task.list.board.id;
    const workspaceId = task.list.board.workspace.id;

    // Decrementar total
    await this.boardRepo.decrement({ id: boardId }, 'tasksTotal', 1);
    await this.workspaceRepo.decrement({ id: workspaceId }, 'tasksTotal', 1);

    // Decrementar completed o pending según el status
    if (task.taskStatus) {
      await this.boardRepo.decrement({ id: boardId }, 'tasksCompleted', 1);
      await this.workspaceRepo.decrement({ id: workspaceId }, 'tasksCompleted', 1);
    } else {
      await this.boardRepo.decrement({ id: boardId }, 'tasksPending', 1);
      await this.workspaceRepo.decrement({ id: workspaceId }, 'tasksPending', 1);
    }
  }
}
