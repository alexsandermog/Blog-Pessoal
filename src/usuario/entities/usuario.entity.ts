import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { MessagesHelper } from '../../helpers/messages.helper';
import { RegExHelper } from '../../helpers/regex.helper';
import { Postagem } from '../../postagem/entities/postagem.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger/dist';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public id: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  @ApiProperty()
  public nome: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  @ApiProperty()
  public sobrenome: string;

  @IsEmail()
  @Column({ nullable: false })
  @ApiProperty({ example: 'email@email.com.br' })
  public email: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  @Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
  @ApiProperty()
  public senha: string;

  @Column({ length: 5000, default: 'default.jpg' })
  @ApiProperty()
  public foto: string;

  @ApiProperty()
  @OneToMany(() => Postagem, (postagem) => postagem.usuario)
  postagem: Postagem[];
}
