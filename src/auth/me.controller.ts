import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class MeController {
  constructor(private readonly jwt: JwtService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Usuario actual (diagnóstico rápido JWT)' })
  @ApiBearerAuth('bearer')
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actual',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string', example: 'admin' },
      },
    },
  })
  me(@Req() req: any) {
    return req.user;
  }

  // Endpoint de diagnóstico: muestra exactamente qué Authorization llega
  @Get('echo')
  @ApiOperation({ summary: 'Echo del header Authorization (diagnóstico)' })
  @ApiResponse({ status: 200, description: 'Devuelve el header Authorization actual', schema: {
    type: 'object',
    properties: { authorization: { type: 'string' } }
  }})
  echo(@Req() req: any) {
    return { authorization: req.headers?.authorization || null };
  }

  // Verifica manualmente el token con el mismo secreto (diagnóstico)
  @Get('verify')
  @ApiOperation({ summary: 'Verificar token con JwtService (diagnóstico)' })
  @ApiResponse({ status: 200, description: 'Payload verificado o error' })
  verify(@Req() req: any) {
    const header: string | undefined = req.headers?.authorization;
    if (!header) return { ok: false, error: 'No Authorization header' };
    const m = /^Bearer\s+(.+)$/i.exec(header);
    if (!m) return { ok: false, error: 'Authorization no es Bearer' };
    const token = m[1];
    try {
      // Usa la configuración global del JwtModule (mismo secreto que firma)
      const payload = this.jwt.verify(token);
      return { ok: true, payload };
    } catch (e: any) {
      return { ok: false, error: e?.message || String(e) };
    }
  }
}
