import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InsightsModule } from './insights/insights.module';
import { AiModule } from './ai-engine/ai.module';
import { MetricsModule } from './metrics/metrics.module';
import { CycleModule } from './cycle/cycle.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true, // Sincroniza automáticamente entidades y relaciones
    }),
    UsersModule,
    AuthModule,
    InsightsModule,
    AiModule,
    MetricsModule,
    CycleModule,
  ],
})
export class AppModule {}
