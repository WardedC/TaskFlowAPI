import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import {
  AddWorkspaceMemberDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from '../dto/workspace.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('workspaces')
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ 
  description: 'No autenticado (falta Bearer token válido). Todos los endpoints de workspaces requieren autenticación JWT.' 
})
export class WorkspacesController {
  constructor(private readonly svc: WorkspacesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo espacio de trabajo',
    description: 'Crea un nuevo workspace. El usuario autenticado se convierte automáticamente en propietario. No es necesario especificar ownerId, se toma del JWT token.'
  })
  @ApiResponse({
    status: 201,
    description: 'Espacio de trabajo creado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        workspaceId: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Mi Nuevo Workspace' },
        id: { type: 'string', example: 'ws-mi-nuevo-workspace' },
        theme: { type: 'string', example: 'indigo' },
        themeColor: { type: 'string', example: '#4F46E5' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos. Verifica que todos los campos requeridos estén presentes y sean válidos.' 
  })
  create(@Body() dto: CreateWorkspaceDto, @Req() req: any) {
    const ownerId = req.user.id;
    return this.svc.create(dto, ownerId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener mis espacios de trabajo',
    description: 'Devuelve únicamente los workspaces donde el usuario autenticado es propietario o miembro. Por seguridad, NO devuelve todos los workspaces del sistema.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mis espacios de trabajo obtenida exitosamente.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          workspaceId: { type: 'number', example: 1 },
          id: { type: 'string', example: 'ws-marketing' },
          title: { type: 'string', example: 'Marketing Team' },
          desc: { type: 'string', example: 'Workspace para el equipo de marketing' },
          theme: { type: 'string', example: 'indigo' },
          themeColor: { type: 'string', example: '#4F46E5' },
          tasks: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 15 },
              completed: { type: 'number', example: 8 },
              pending: { type: 'number', example: 7 }
            }
          },
          members: { type: 'number', example: 5 },
          boards: { type: 'number', example: 3 },
          isFavorite: { type: 'boolean', example: false }
        }
      }
    }
  })
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.svc.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener mi workspace por ID',
    description: 'Obtiene detalles de un workspace específico. Solo funciona si el usuario autenticado es propietario o miembro del workspace.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del espacio de trabajo',
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Espacio de trabajo encontrado.',
    schema: {
      type: 'object',
      properties: {
        workspaceId: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Marketing Team' },
        owner: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@example.com' }
          }
        },
        membersDetail: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              role: { type: 'string', example: 'owner' },
              userName: { type: 'string', example: 'Juan Pérez' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de trabajo no encontrado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a este workspace. Solo puedes acceder a workspaces donde eres propietario o miembro.',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.id;
    return this.svc.findOne(id, userId);
  }

  @Get(':id/overview')
  @ApiOperation({
    summary: 'Vista general de mi workspace con estadísticas',
    description: 'Obtiene estadísticas detalladas del workspace incluyendo conteos de boards, listas y tareas. Solo accesible si eres propietario o miembro.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del espacio de trabajo',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Vista general del workspace obtenida.',
    schema: {
      type: 'object',
      properties: {
        workspaceId: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Marketing Team' },
        tasks: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 15 },
            completed: { type: 'number', example: 8 },
            pending: { type: 'number', example: 7 }
          }
        },
        boardStats: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'Sprint Planning' },
              listCount: { type: 'number', example: 4 },
              taskCount: { type: 'number', example: 12 }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de trabajo no encontrado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a este workspace.',
  })
  findOneOverview(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.id;
    return this.svc.findOneOverview(id, userId);
  }

  @Get(':id/full')
  @ApiOperation({
    summary: 'Workspace completo con estructura jerárquica',
    description: 'Obtiene el workspace completo incluyendo boards → lists → tasks en estructura jerárquica. Ideal para cargar toda la información de un workspace tipo Kanban. Solo accesible si eres propietario o miembro.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del espacio de trabajo',
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Workspace completo obtenido.',
    schema: {
      type: 'object',
      properties: {
        workspaceId: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Marketing Team' },
        boardTrees: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'Sprint Planning' },
              lists: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    title: { type: 'string', example: 'To Do' },
                    position: { type: 'number', example: 1 },
                    tasks: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          title: { type: 'string', example: 'Crear landing page' },
                          description: { type: 'string', example: 'Diseñar y desarrollar la nueva landing page' },
                          taskStatus: { type: 'boolean', example: false },
                          position: { type: 'number', example: 1 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de trabajo no encontrado.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a este workspace.',
  })
  findOneWithFullData(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.id;
    return this.svc.findOneWithFullData(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un espacio de trabajo' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Espacio de trabajo actualizado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de trabajo no encontrado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un espacio de trabajo' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Espacio de trabajo eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de trabajo no encontrado.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Agregar un miembro al espacio de trabajo' })
  @ApiParam({ name: 'id', description: 'ID del espacio de trabajo' })
  @ApiResponse({ status: 201, description: 'Miembro agregado exitosamente.' })
  @ApiResponse({
    status: 404,
    description: 'Espacio de trabajo o usuario no encontrado.',
  })
  addMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddWorkspaceMemberDto,
  ) {
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
