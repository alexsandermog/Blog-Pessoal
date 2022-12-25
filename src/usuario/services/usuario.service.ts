import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findByEmail(email: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { email },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: {
        postagem: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario> {
    const buscaUsuario = await this.usuarioRepository.findOne({
      where: {
        id,
      },
      relations: {
        postagem: true,
      },
    });

    if (!buscaUsuario)
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);

    return buscaUsuario;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const buscaUsuario = await this.findByEmail(usuario.email);

    if (!buscaUsuario) {
      usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
      return await this.usuarioRepository.save(usuario);
    }

    throw new HttpException('O usuário já existe!', HttpStatus.NOT_FOUND);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const updateUsuario: Usuario = await this.findById(usuario.id);
    const buscaUsuario = await this.findByEmail(usuario.email);

    if (!updateUsuario)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    if (buscaUsuario && buscaUsuario.id != usuario.id)
      throw new HttpException(
        'E-mail já está cadastrado.',
        HttpStatus.BAD_REQUEST,
      );

    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);

    return await this.usuarioRepository.save(usuario);
  }
}
