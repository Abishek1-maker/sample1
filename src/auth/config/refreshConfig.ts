/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refresh',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_SECRET,
    expiresIn: (process.env.REFRESH_EXPIRE_IN ?? '1d') as any,
  }),
);
