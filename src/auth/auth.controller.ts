/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { refreshGuards } from './guards/refresh-auth/guards/refresh.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}
  //-----------------Login-------------
  @ApiOperation({ summary: 'Login User' })
  @ApiBody({
    schema: {
      example: {
        email: '',
        password: '',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authservice.login(req.user.id);
  }
  //-----------------------Refresh------------------
  @ApiOperation({ summary: 'Get Refresh token' })
  @ApiBearerAuth()
  @UseGuards(refreshGuards)
  @Post('refresh')
  refreshToken(@Req() req: any) {
    this.authservice.refreshToken(req.user.id);
  }
}
