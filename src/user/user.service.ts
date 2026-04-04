/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(Data: CreateUserDto) {
    if (Data.password) {
      Data.password = await bcrypt.hash(Data.password, 10);
    }
    return this.prisma.user.create({ data: Data });
  }

  findAll() {
    return this.prisma.user.findMany();
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
