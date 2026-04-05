import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Authjwtpayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtservice: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userservice.findByEmail(email);
    if (!user) throw new UnauthorizedException('User is not found');
    const IspasswordMatch = await compare(password, user.password);
    if (!IspasswordMatch)
      throw new UnauthorizedException('password doesnot match');
    return { id: user.id };
  }
  //---------------------------Generate Tokens---------------------------
  login(userId: number) {
    const payload: Authjwtpayload = { sub: userId };
    return this.jwtservice.sign(payload);
  }
}
