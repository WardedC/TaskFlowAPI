import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { AssignUserDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { CreateCommentDto } from '../dto/comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado (falta Bearer token)' })
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid task data' })
  create(@Body() dto: CreateTaskDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.svc.update(id, dto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ 
    summary: 'Toggle task completion status',
    description: 'Alterna el estado de completado de una tarea (true/false) y actualiza automáticamente los contadores del board y workspace'
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Task status toggled successfully and counters updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.svc.toggleStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Post(':id/assignees')
  @ApiOperation({ summary: 'Assign a user to a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'User assigned to task successfully',
  })
  @ApiResponse({ status: 404, description: 'Task or user not found' })
  @ApiResponse({
    status: 409,
    description: 'User already assigned to this task',
  })
  assign(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignUserDto) {
    return this.svc.assignUser(id, dto);
  }

  @Delete(':id/assignees/:assigneeId')
  @ApiOperation({ summary: 'Unassign a user from a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: 'number' })
  @ApiParam({
    name: 'assigneeId',
    description: 'User ID to unassign',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'User unassigned from task successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Task, user, or assignment not found',
  })
  unassign(
    @Param('id', ParseIntPipe) id: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ) {
    return this.svc.unassignUser(id, assigneeId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: 'number' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  comment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
  ) {
    // ensure path id matches body taskId if provided
    dto.taskId = id;
    return this.svc.addComment(dto);
  }
}
