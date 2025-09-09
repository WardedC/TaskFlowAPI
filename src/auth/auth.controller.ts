import { Body, Controller, Post, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto, DeleteAccountDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario', description: 'Registra un usuario en el sistema. No devuelve accessToken. Para obtener token, usa /auth/login con un usuario admin.' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente (sin accessToken).',
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso. accessToken presente �nicamente para rol admin.',
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Delete('account/:userId')
  @ApiOperation({ summary: 'Eliminar cuenta de usuario (requiere contraseña)' })
  @ApiParam({ name: 'userId', description: 'ID del usuario a eliminar', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuenta eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Cuenta eliminada exitosamente. Esperamos verte de nuevo en el futuro.' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Contraseña incorrecta' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async deleteAccount(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: DeleteAccountDto,
  ): Promise<{ message: string }> {
    return this.authService.deleteAccount(userId, dto);
  }
}

