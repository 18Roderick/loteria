import { Injectable } from '@nestjs/common';
import { PrismaServices } from 'src/databases/prisma.services';
import { CreateLoteriaDto } from './dto/create-loteria.dto';
import { UpdateLoteriaDto } from './dto/update-loteria.dto';

@Injectable()
export class LoteriaService {
  constructor(private prismaServices: PrismaServices) {}
  create(createLoteriaDto: CreateLoteriaDto) {
    return 'This action adds a new loteria';
  }

  findAll() {
    return this.prismaServices.sorteos.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} loteria`;
  }

  update(id: number, updateLoteriaDto: UpdateLoteriaDto) {
    return `This action updates a #${id} loteria`;
  }

  remove(id: number) {
    return `This action removes a #${id} loteria`;
  }
}
