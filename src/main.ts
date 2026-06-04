import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Inicializa la aplicación NestJS de forma segura
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir conexiones externas (como desde el APK)
  app.enableCors();

  // Tu Banner Magenta Industrial de AuraHealth+
  console.log('\x1b[35m%s\x1b[0m', `
  #####################################################################
  #   AURAHEALTH+ HYBRID AI ECOSYSTEM | SISTEMA INDUSTRIAL            #
  #   DESARROLLADO Y FIRMADO POR: FRANCYS ALVARADO                    #
  #####################################################################
  `);

  // Escucha en el puerto asignado por Render o 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();