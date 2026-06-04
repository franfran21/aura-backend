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

  // Escucha el puerto 3000 en todas las interfaces (necesario para acceso desde el móvil)
  await app.listen(3000, '0.0.0.0');
}
bootstrap();