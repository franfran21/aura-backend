import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  async findDaily(userId: number, date: Date): Promise<Insight[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return await this.insightRepository.find({
      where: { 
        user: { id: userId },
        createdAt: Between(start, end)
      },
      order: { createdAt: 'DESC' },
    });
  }

  async createInsight(metricsRaw: string, user: any, aiDiagnosis?: string, title?: string, description?: string): Promise<Insight> {
    const today = new Date();
    // Intentar obtener métricas y ciclo reales
    const metrics = await this.metricsService.getDailyMetrics(user.sub || user.id, today);
    const cycle = await this.cycleService.getCurrentCycle(user.sub || user.id);

    const newInsight = this.insightRepository.create({
      title: title || 'Análisis Diario',
      description: description || 'Basado en tus registros de hoy.',
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
