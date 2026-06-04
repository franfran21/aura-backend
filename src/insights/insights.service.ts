import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from './insight.entity';
import { User } from '../users/user.entity';
import { MetricsService } from '../metrics/metrics.service';
import { CycleService } from '../cycle/cycle.service';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Insight)
    private readonly insightRepository: Repository<Insight>,
    private readonly metricsService: MetricsService,
    private readonly cycleService: CycleService,
  ) {}

  async createInsight(metricsRaw: string, user: any, aiDiagnosis?: string): Promise<Insight> {
    const today = new Date();
    // Intentar obtener métricas y ciclo reales
    const metrics = await this.metricsService.getDailyMetrics(user.sub || user.id, today);
    const cycle = await this.cycleService.getCurrentCycle(user.sub || user.id);

    const newInsight = this.insightRepository.create({
      metricsRaw: metricsRaw || JSON.stringify(metrics),
      aiDiagnosis,
      user: { id: user.sub || user.id } as User,
    });
    return await this.insightRepository.save(newInsight);
  }

  async findByUserId(userId: number): Promise<Insight[]> {
    return await this.insightRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getUserCycleContext(userId: number) {
    return await this.cycleService.getCurrentCycle(userId);
  }
}
