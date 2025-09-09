import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('boards')
@Controller('boards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado (falta Bearer token)' })
export class BoardsController {
  constructor(private readonly svc: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tablero' })
  @ApiResponse({ status: 201, description: 'Tablero creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Espacio de trabajo no encontrado.' })
  create(@Body() dto: CreateBoardDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tableros' })
  @ApiResponse({ status: 200, description: 'Lista de tableros obtenida exitosamente.' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tablero por ID' })
  @ApiParam({ name: 'id', description: 'ID del tablero' })
  @ApiResponse({ status: 200, description: 'Tablero encontrado.' })
  @ApiResponse({ status: 404, description: 'Tablero no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tablero' })
  @ApiParam({ name: 'id', description: 'ID del tablero' })
  @ApiResponse({ status: 200, description: 'Tablero actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tablero no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBoardDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tablero' })
  @ApiParam({ name: 'id', description: 'ID del tablero' })
  @ApiResponse({ status: 200, description: 'Tablero eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tablero no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
