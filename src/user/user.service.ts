/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ConflictException, Injectable, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE } from 'src/utils/constant';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailservice: MailService,
  ) {}
  async create(Data: CreateUserDto) {
    if (Data.password) {
      Data.password = await bcrypt.hash(Data.password, 10);
    }
    const existing = await this.prisma.user.findUnique({
      where: { email: Data.email },
    });
    if (existing) throw new ConflictException('Email is already exist');
    const user = await this.prisma.user.create({ data: Data });
    if (user.email && user.name)
      await this.mailservice.sendWelcomeEmail(user.email, user.name);
    return user;
  }

  findAll(@Query() pagination: paginationDto) {
    return this.prisma.user.findMany({
      skip: pagination.skip,
      take: pagination.limit ?? DEFAULT_PAGE,
    });
  }
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, Data: UpdateUserDto) {
    if (Data.password) {
      Data.password = await bcrypt.hash(Data.password, 10);
    }
    return await this.prisma.user.update({ where: { id }, data: Data });
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: `${id} id is deleted` };
  }
}
