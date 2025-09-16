import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export type JwtPayload = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly cfg: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Logs de diagnóstico temporales
    try {
      console.log('[JWT] Payload recibido:', payload);
      const user = await this.users.findOne({ where: { id: payload.sub } });
      if (!user) {
        console.warn('[JWT] Usuario no encontrado para sub:', payload.sub);
        throw new UnauthorizedException('Usuario no encontrado');
      }
      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      console.log('[JWT] Usuario validado:', safeUser);
      return safeUser;
    } catch (e) {
      console.error('[JWT] Error en validate:', e?.message || e);
      throw e;
    }
  }
}
