import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog Pessoal')
    .setDescription('Projeto Blog Pessoal')
    .setContact(
      'Rafaele Souza',
      'http://rafaelesouza.com',
      'rafaelessv@gmail.com',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  process.env.TZ = '-03:00'; //alterar timezone para horario de brasilia

  app.useGlobalPipes(new ValidationPipe()); //usar class-validator em todas as requisiçoes
  app.enableCors(); //sistema que permite requisiçoes externas
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
