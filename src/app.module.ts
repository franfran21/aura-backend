import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InsightsModule } from './insights/insights.module';
import { AiModule } from './ai-engine/ai.module';
import { MetricsModule } from './metrics/metrics.module';
import { CycleModule } from './cycle/cycle.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Conexión para Supabase ( Railway inyectará DATABASE_URL )
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Útil para prototipos, cambiar a false en producción real con migraciones
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false // Requerido por Supabase y Railway para conexiones SSL
      },
      // Configuración de pool para Supabase
      extra: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    }),
    UsersModule,
    AuthModule,
    InsightsModule,
    AiModule,
    MetricsModule,
    CycleModule,
    ChatModule,
  ],
})
export class AppModule {}
