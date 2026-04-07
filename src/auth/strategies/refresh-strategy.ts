import { Inject, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import refreshConfig from '../config/refreshConfig';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Authjwtpayload } from '../types/jwt-payload';
import { Request } from 'express';
import { AuthService } from '../auth.service';

export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshconfiguration: ConfigType<typeof refreshConfig>,
    private authservice: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshconfiguration as string,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: Authjwtpayload) {
    const refreshHeader = req.get('Authorization');
    if (!refreshHeader) throw new NotFoundException('Refresh Header not found');
    const refreshToken = refreshHeader.replace('Bearer', '').trim();
    const userId = payload.sub;
    return this.authservice.validaterefreshToken(userId, refreshToken);
  }
}
