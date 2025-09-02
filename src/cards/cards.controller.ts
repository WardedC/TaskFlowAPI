import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AssignUserDto, CreateCardDto, UpdateCardDto } from '../dto/card.dto';
import { CreateCommentDto } from '../dto/comment.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly svc: CardsService) {}

  @Post()
  create(@Body() dto: CreateCardDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCardDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Post(':id/assignees')
  assign(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignUserDto) {
    return this.svc.assignUser(id, dto);
  }

  @Delete(':id/assignees/:assigneeId')
  unassign(
    @Param('id', ParseIntPipe) id: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ) {
    return this.svc.unassignUser(id, assigneeId);
  }

  @Post(':id/comments')
  comment(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCommentDto) {
    // ensure path id matches body cardId if provided
    dto.cardId = id;
    return this.svc.addComment(dto);
  }
}
