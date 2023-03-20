import { PartialType } from '@nestjs/mapped-types';
import { CreateLoteriaDto } from './create-loteria.dto';

export class UpdateLoteriaDto extends PartialType(CreateLoteriaDto) {}
