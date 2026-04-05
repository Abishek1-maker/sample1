//If the JWT is valid and alow user to access or not
//STEP6::created manually
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import jwtconfig from '../config/jwtconfig';
import { Authjwtpayload } from '../types/jwt-payload';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtconfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtconfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //<--from where to req
      secretOrKey: jwtConfiguration.secret as string, //<--get from configuration secret key to decode
    });
  }
  //it is  not for jwt validate it is just receice decode payload that decode was done from Aboce base code in up super
  //payload has aready validated then passed here
  validate(payload: Authjwtpayload) {
    return { id: payload.sub }; //<---sub is user id see in auth service it is now decoded
  }
}
