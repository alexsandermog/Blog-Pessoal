import { ApiProperty } from '@nestjs/swagger';

export class UsuarioLogin {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public senha: string;
}
