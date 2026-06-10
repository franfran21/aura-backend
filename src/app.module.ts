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
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
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
