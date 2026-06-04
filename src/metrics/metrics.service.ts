import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Metric } from './metric.entity';
import { User } from '../users/user.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
  ) {}

  async saveMetrics(userId: number, data: any) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const existing = await this.metricRepository.findOne({
      where: { user: { id: userId }, date: Between(start, end) }
    });

    if (existing) {
      Object.assign(existing, data);
      return this.metricRepository.save(existing);
    }

    const metric = this.metricRepository.create({ ...data, user: { id: userId } });
    return this.metricRepository.save(metric);
  }

  async getDailyMetrics(userId: number, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.metricRepository.findOne({
      where: { user: { id: userId }, date: Between(start, end) }
    });
  }
}
