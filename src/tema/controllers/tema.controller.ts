import { Controller, HttpStatus, ParseIntPipe } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Tema } from '../entities/tema.entity';
import { TemaService } from '../services/tema.service';

@ApiTags('Tema')
@UseGuards(JwtAuthGuard)
@Controller('/temas')
@ApiBearerAuth()
export class TemaController {
  constructor(private readonly temaService: TemaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Tema[]> {
    return this.temaService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Tema> {
    return this.temaService.findById(id);
  }

  @Get('descricao/:descricao')
  @HttpCode(HttpStatus.OK)
  findByDescricao(@Param('descricao') descricao: string): Promise<Tema[]> {
    return this.temaService.findByDescricao(descricao);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    tema: Tema,
  ): Promise<Tema> {
    return this.temaService.create(tema);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(
    @Body()
    tema: Tema,
  ): Promise<Tema> {
    return this.temaService.update(tema);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.temaService.delete(id);
  }
}
