import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemaController } from './controllers/tema.controller';
import { Tema } from './entities/tema.entity';
import { TemaService } from './services/tema.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tema])],
  controllers: [TemaController],
  providers: [TemaService],
  exports: [TypeOrmModule],
})
export class TemaModule {}
