import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import refreshConfig from '../config/refreshConfig';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Authjwtpayload } from '../types/jwt-payload';

export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshconfiguration: ConfigType<typeof refreshConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_EXPIRE_IN as string,
    });
  }
  validate(payload: Authjwtpayload) {
    return { id: payload.sub };
  }
}
