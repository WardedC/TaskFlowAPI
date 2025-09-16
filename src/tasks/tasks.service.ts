import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { List } from '../entities/list.entity';
import { TaskAssignee } from '../entities/task-assignee.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
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
    return this.taskRepo.save(task);
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
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.position !== undefined) task.position = dto.position;
    if (dto.taskStatus !== undefined) task.taskStatus = dto.taskStatus;
    if (dto.listId !== undefined) {
      const list = await this.listRepo.findOne({ where: { id: dto.listId } });
      if (!list) throw new NotFoundException('List not found');
      task.list = list;
    }
    return this.taskRepo.save(task);
  }

  async remove(id: number) {
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
}
