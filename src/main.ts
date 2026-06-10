import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Health check endpoint para Render sin autenticación
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (req, res) => {
    res.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'AuraHealth+ Backend',
    });
  });

  console.log('\x1b[35m%s\x1b[0m', `
  #####################################################################
  #   AURAHEALTH+ HYBRID AI ECOSYSTEM | SISTEMA INDUSTRIAL            #
  #   DESARROLLADO Y FIRMADO POR: FRANCYS ALVARADO                    #
  #####################################################################
  `);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
