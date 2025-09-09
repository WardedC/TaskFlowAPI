import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { AddWorkspaceMemberDto, CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto/workspace.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('workspaces')
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado (falta Bearer token)' })
export class WorkspacesController {
  constructor(private readonly svc: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo espacio de trabajo' })
  @ApiResponse({ status: 201, description: 'Espacio de trabajo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Usuario propietario no encontrado.' })
  create(@Body() dto: CreateWorkspaceDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los espacios de trabajo' })
  @ApiResponse({ status: 200, description: 'Lista de espacios de trabajo obtenida exitosamente.' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un espacio de trabajo por ID (versión ligera)' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({ status: 200, description: 'Espacio de trabajo encontrado.' })
  @ApiResponse({ status: 404, description: 'Espacio de trabajo no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Get(':id/overview')
  @ApiOperation({ summary: 'Obtener vista general del workspace con estadísticas' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({ status: 200, description: 'Vista general del workspace obtenida.' })
  @ApiResponse({ status: 404, description: 'Espacio de trabajo no encontrado.' })
  findOneOverview(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOneOverview(id);
  }

  @Get(':id/full')
  @ApiOperation({ summary: 'Obtener workspace completo con boards, listas y cartas' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({ status: 200, description: 'Workspace completo obtenido.' })
  @ApiResponse({ status: 404, description: 'Espacio de trabajo no encontrado.' })
  findOneWithFullData(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOneWithFullData(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un espacio de trabajo' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({ status: 200, description: 'Espacio de trabajo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Espacio de trabajo no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWorkspaceDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un espacio de trabajo' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({ status: 200, description: 'Espacio de trabajo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Espacio de trabajo no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Agregar un miembro al espacio de trabajo' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({ status: 201, description: 'Miembro agregado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Espacio de trabajo o usuario no encontrado.' })
  addMember(@Param('id', ParseIntPipe) id: number, @Body() dto: AddWorkspaceMemberDto) {
    return this.svc.addMember(id, dto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remover un miembro del espacio de trabajo' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiParam({ name: 'memberId', description: 'ID del miembro a remover' })
  @ApiResponse({ status: 200, description: 'Miembro removido exitosamente.' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado.' })
  removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.svc.removeMember(id, memberId);
  }
}
