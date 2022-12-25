import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

describe('Testes dos Módulos Usuário de Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'db_blogpessoal_test',
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          dropSchema: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar usuario', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        sobrenome: 'Root',
        email: 'root@root.com',
        senha: 'Root@1234',
      });
    expect(201);

    usuarioId = resposta.body.id;
  });

  it('02 - Deve autenticar usuario (login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'root@root.com',
        senha: 'Root@1234',
      });
    expect(200);

    token = resposta.body.token;
  });

  it('03 - Não deve duplicar o usuário', async () => {
    return request(app.getHttpServer()).post('/usuarios/cadastrar').send({
      nome: 'Root',
      sobrenome: 'Root',
      email: 'root@root.com',
      senha: 'Root@1234',
    });
    expect(400);
  });

  it('04 - Deve listar todos os usuarios', async () => {
    request(app.getHttpServer())
      .get('usuarios/all')
      .set('Authorization', `${token}`)
      .send({});
    expect(200);
  });

  it('05 - Deve atualizar um usuario', async () => {
    request(app.getHttpServer())
      .put('usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root atualizado',
        sobrenome: 'Root',
        email: 'root@root.com',
        senha: 'Root@1234',
        foto: 'https://image.api.playstation.com/vulcan/img/rnd/202010/2119/VljHbt4vhc3Bmn8s83kFAPVg.png',
      })
      .then((resposta) => {
        expect('Root atualizado').toEqual(resposta.body.nome);
      });
    expect(200);
  });
});
