import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { AssignUserDto, CreateCardDto, UpdateCardDto } from '../dto/card.dto';
import { CreateCommentDto } from '../dto/comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('cards')
@Controller('cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado (falta Bearer token)' })
export class CardsController {
  constructor(private readonly svc: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid card data' })
  create(@Body() dto: CreateCardDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({ status: 200, description: 'List of all cards' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific card by ID' })
  @ApiParam({ name: 'id', description: 'Card ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Card found' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a card' })
  @ApiParam({ name: 'id', description: 'Card ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCardDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card' })
  @ApiParam({ name: 'id', description: 'Card ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Post(':id/assignees')
  @ApiOperation({ summary: 'Assign a user to a card' })
  @ApiParam({ name: 'id', description: 'Card ID', type: 'number' })
  @ApiResponse({ status: 201, description: 'User assigned to card successfully' })
  @ApiResponse({ status: 404, description: 'Card or user not found' })
  @ApiResponse({ status: 409, description: 'User already assigned to this card' })
  assign(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignUserDto) {
    return this.svc.assignUser(id, dto);
  }

  @Delete(':id/assignees/:assigneeId')
  @ApiOperation({ summary: 'Unassign a user from a card' })
  @ApiParam({ name: 'id', description: 'Card ID', type: 'number' })
  @ApiParam({ name: 'assigneeId', description: 'User ID to unassign', type: 'number' })
  @ApiResponse({ status: 200, description: 'User unassigned from card successfully' })
  @ApiResponse({ status: 404, description: 'Card, user, or assignment not found' })
  unassign(
    @Param('id', ParseIntPipe) id: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ) {
    return this.svc.unassignUser(id, assigneeId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a card' })
  @ApiParam({ name: 'id', description: 'Card ID', type: 'number' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  comment(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCommentDto) {
    // ensure path id matches body cardId if provided
    dto.cardId = id;
    return this.svc.addComment(dto);
  }
}
