import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from './metric.entity';
import { CycleModule } from '../cycle/cycle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric]),
    CycleModule,
  ],
  providers: [MetricsService],
  controllers: [MetricsController],
  exports: [MetricsService],
})
export class MetricsModule {}
