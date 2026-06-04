import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { Insight } from './insight.entity';
import { MetricsModule } from '../metrics/metrics.module';
import { CycleModule } from '../cycle/cycle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insight]),
    MetricsModule,
    CycleModule,
  ],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}
