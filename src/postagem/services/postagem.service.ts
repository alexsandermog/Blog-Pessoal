import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemaService } from 'src/tema/services/tema.service';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Postagem } from '../entities/postagem.entity';

@Injectable()
export class PostagemService {
  constructor(
    @InjectRepository(Postagem)
    private postagemRepository: Repository<Postagem>,
    private temaService: TemaService,
  ) {}

  async findAll(): Promise<Postagem[]> {
    return await this.postagemRepository.find({
      relations: {
        tema: true,
        usuario: true,
      },
    });
  }

  async findById(id: number): Promise<Postagem> {
    const postagem = await this.postagemRepository.findOne({
      where: {
        id,
      },
      relations: {
        tema: true,
        usuario: true,
      },
    });

    if (!postagem) {
      throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);
    }

    return postagem;
  }

  async findByTitulo(titulo: string): Promise<Postagem[]> {
    return await this.postagemRepository.find({
      where: {
        titulo: ILike(`%${titulo}%`),
      },
      relations: {
        tema: true,
        usuario: true,
      },
    });
  }

  async create(postagem: Postagem): Promise<Postagem> {
    if (postagem.tema) {
      const tema = await this.temaService.findById(postagem.tema.id);
      if (!tema) {
        throw new HttpException('Tema não encontrado.', HttpStatus.NOT_FOUND);
      }
    }
    return await this.postagemRepository.save(postagem);
  }

  async update(postagem: Postagem): Promise<Postagem> {
    const buscaPostagem: Postagem = await this.findById(postagem.id);

    if (!buscaPostagem || !postagem) {
      throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);
    }

    if (postagem.tema) {
      const tema = await this.temaService.findById(postagem.tema.id);

      if (!tema) {
        throw new HttpException('Tema não encontrado.', HttpStatus.NOT_FOUND);
      }
    }
    return await this.postagemRepository.save(postagem);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaPostagem = await this.findById(id);

    if (!buscaPostagem) {
      throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);
    }
    return await this.postagemRepository.delete(id);
  }
}
