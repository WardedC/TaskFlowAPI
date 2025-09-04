import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ListsService } from './lists.service';
import { CreateListDto, UpdateListDto } from '../dto/list.dto.js';

@ApiTags('lists')
@Controller('lists')
export class ListsController {
  constructor(private readonly svc: ListsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva lista' })
  @ApiResponse({ status: 201, description: 'Lista creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Tablero no encontrado.' })
  create(@Body() dto: CreateListDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las listas' })
  @ApiResponse({ status: 200, description: 'Lista de listas obtenida exitosamente.' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una lista por ID' })
  @ApiParam({ name: 'id', description: 'ID de la lista' })
  @ApiResponse({ status: 200, description: 'Lista encontrada.' })
  @ApiResponse({ status: 404, description: 'Lista no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una lista' })
  @ApiParam({ name: 'id', description: 'ID de la lista' })
  @ApiResponse({ status: 200, description: 'Lista actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Lista no encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateListDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una lista' })
  @ApiParam({ name: 'id', description: 'ID de la lista' })
  @ApiResponse({ status: 200, description: 'Lista eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Lista no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
