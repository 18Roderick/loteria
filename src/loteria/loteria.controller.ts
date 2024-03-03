import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoteriaService } from './loteria.service';
import { CreateLoteriaDto } from './dto/create-loteria.dto';
import { UpdateLoteriaDto } from './dto/update-loteria.dto';

@Controller('loteria')
export class LoteriaController {
  constructor(private readonly loteriaService: LoteriaService) {}

  @Post()
  create(@Body() createLoteriaDto: CreateLoteriaDto) {
    return this.loteriaService.create(createLoteriaDto);
  }

  @Get()
  findAll() {
    return this.loteriaService.findAll();
  }

  @Get('execute')
  async ExecuteScrapper() {
    await this.loteriaService.executeSrapper();
    return {
      ok: true,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loteriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoteriaDto: UpdateLoteriaDto) {
    return this.loteriaService.update(+id, updateLoteriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loteriaService.remove(+id);
  }
}
