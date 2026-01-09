import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 1. Start listening (don't capture the return value)
  await app.listen(process.env.PORT ?? 8082);

  // 2. Get the underlying HTTP server instance explicitly
  // We cast to 'unknown' first, then 'Server' to satisfy the linter
  const server = app.getHttpServer() as unknown as Server;

  // 3. Set the timeout
  server.setTimeout(0);
}
bootstrap();
