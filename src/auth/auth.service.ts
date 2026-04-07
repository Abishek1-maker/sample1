import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Authjwtpayload } from './types/jwt-payload';
import { ConfigType } from '@nestjs/config';
import refreshConfig from './config/refreshConfig';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtservice: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userservice.findByEmail(email);
    if (!user) throw new UnauthorizedException('User is not found');
    const IspasswordMatch = await compare(password, user.password);
    if (!IspasswordMatch)
      throw new UnauthorizedException('password doesnot match');
    return { id: user.id };
  }
  //-------------------------------Validate refresh token---------------
  async validaterefreshToken(userId: number, refreshToken: string) {
    const user = await this.userservice.findOne(userId);
    if (!user || !refreshToken || !user.hashedRefreshToken)
      throw new NotFoundException('refresh token  not found');
    const refreshTokenMatch = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatch)
      throw new UnauthorizedException('refrehs token not matches');
    return { id: userId };
  }

  //---------------------------Generate Tokens---------------------------
  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userservice.updateRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }
  //---------------------Generate BOTH Token--------------
  async generateTokens(userId: number) {
    const payload: Authjwtpayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtservice.signAsync(payload),
      this.jwtservice.signAsync(payload, this.refreshConfiguration),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  //-------------------Refresh Token------------
  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userservice.updateRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      new_accessToken: accessToken,
      new_refreshToken: refreshToken,
    };
  }
  //--------------------Sign Out------------------------
  async signout(userId: number) {
    await this.userservice.updateRefreshToken(userId, '');
    return { message: 'user is signout' };
  }
}
