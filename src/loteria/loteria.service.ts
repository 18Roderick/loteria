import { Injectable } from '@nestjs/common';
import { PrismaServices as PrismaService } from '../databases/prisma.services';
import { CreateLoteriaDto } from './dto/create-loteria.dto';
import { UpdateLoteriaDto } from './dto/update-loteria.dto';
import { ScrapAllSorteos } from '../scrapper';

@Injectable()
export class LoteriaService {
  constructor(private prismaServices: PrismaService) {}
  create(createLoteriaDto: CreateLoteriaDto) {
    return 'This action adds a new loteria';
  }

  findAll() {
    return this.prismaServices.sorteos.findMany({
      orderBy: [
        {
          Fecha: 'desc',
        },
      ],
    });
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

  executeSrapper() {
    return ScrapAllSorteos();
  }
}
