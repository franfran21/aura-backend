import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cycle } from './cycle.entity';

@Injectable()
export class CycleService {
  constructor(
    @InjectRepository(Cycle)
    private readonly cycleRepository: Repository<Cycle>,
  ) {}

  async getCurrentCycle(userId: number) {
    const cycle = await this.cycleRepository.findOne({
      where: { user: { id: userId } },
      order: { lastPeriodDate: 'DESC' }
    });

    if (!cycle) return null;

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - cycle.lastPeriodDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let phase = 'Folicular';
    if (diffDays <= 5) phase = 'Menstrual';
    else if (diffDays > 12 && diffDays <= 16) phase = 'Ovulatoria';
    else if (diffDays > 16) phase = 'Lútea';

    return {
      ...cycle,
      currentDay: diffDays,
      phase
    };
  }
}
