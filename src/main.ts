import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  const configService = app.get(ConfigService);
  const host = configService.get<string>('host');
  const port = configService.get<number>('port');
  const environment = configService.get<string>('node.env');
  await app.listen(port, host);
  Logger.log(
    `Env: ${environment}, Server is started on http://${host}:${port}`,
  );
}
bootstrap();
