import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsuarioService } from '../../usuario/services/usuario.service';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const buscaUsuario = await this.usuarioService.findByEmail(username);

    if (!buscaUsuario)
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);

    const valida = await this.bcrypt.compararSenhas(
      buscaUsuario.senha,
      password,
    );

    if (buscaUsuario && valida) {
      // desestruturação: armazena a senha na variável senha e todo o resto na variável result
      const { senha, ...result } = buscaUsuario;
      return result;
    }

    return null;
  }

  async login(usuarioLogin: UsuarioLogin) {
    const payload = {
      sub: 'blogpessoal',
      username: usuarioLogin.email,
    };

    return {
      usuario: usuarioLogin.email,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
