import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local-strategy';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import jwtconfig from './config/jwtconfig';
import { ConfigModule } from '@nestjs/config';
import { RefreshJwtStrategy } from './strategies/refresh-strategy';
import refreshConfig from './config/refreshConfig';

@Module({
  imports: [
    JwtModule.registerAsync(jwtconfig.asProvider()),
    ConfigModule.forFeature(jwtconfig),
    ConfigModule.forFeature(refreshConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService, RefreshJwtStrategy],
})
export class AuthModule {}
