import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userservice: UserService) {}
  async validateUser(email: string, password: string) {
    const user = await this.userservice.findByEmail(email);
    if (!user) throw new UnauthorizedException('User is not found');
    const IspasswordMatch = await compare(password, user.password);
    if (!IspasswordMatch)
      throw new UnauthorizedException('password doesnot match');
    return { id: user.id };
  }
}
