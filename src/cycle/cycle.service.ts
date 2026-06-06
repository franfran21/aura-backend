import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cycle } from './cycle.entity';
import { CycleLog } from './cycle-log.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CycleService {
  constructor(
    @InjectRepository(Cycle)
    private readonly cycleRepository: Repository<Cycle>,
    @InjectRepository(CycleLog)
    private readonly cycleLogRepository: Repository<CycleLog>,
  ) {}

  async getCurrentCycle(userId: number) {
    const cycle = await this.cycleRepository.findOne({
      where: { user: { id: userId } },
      order: { lastPeriodDate: 'DESC' },
    });
    if (!cycle) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastPeriod = new Date(cycle.lastPeriodDate);
    lastPeriod.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastPeriod.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let phase = 'Folicular';
    if (diffDays <= cycle.avgPeriodLength) phase = 'Menstrual';
    else if (diffDays > cycle.avgCycleLength - 7 && diffDays <= cycle.avgCycleLength) phase = 'Lútea';
    else if (diffDays >= 11 && diffDays <= 16) phase = 'Ovulatoria';

    const ovulationDay = cycle.avgCycleLength - 14;
    const fertileStart = Math.max(1, ovulationDay - 5);
    const fertileEnd = Math.min(cycle.avgCycleLength, ovulationDay + 1);

    // Calculate next period start
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + cycle.avgCycleLength);

    return {
      id: cycle.id,
      lastPeriodDate: cycle.lastPeriodDate,
      avgCycleLength: cycle.avgCycleLength,
      avgPeriodLength: cycle.avgPeriodLength,
      currentDay: diffDays,
      phase,
      ovulationDay,
      fertileWindow: { start: fertileStart, end: fertileEnd },
      nextPeriodDate: nextPeriod.toISOString().split('T')[0],
    };
  }

  async getCalendarMonth(userId: number, year: number, month: number) {
    const cycle = await this.cycleRepository.findOne({
      where: { user: { id: userId } },
      order: { lastPeriodDate: 'DESC' },
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: any[] = [];

    // Get all logs for this month
    const startStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endStr = `${year}-${String(month + 1).padStart(2, '0')}-${daysInMonth}`;
    const logs = await this.cycleLogRepository.find({
      where: { user: { id: userId }, date: Between(startStr, endStr) },
    });

    const logMap = new Map(logs.map(l => [l.date, l]));

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const log = logMap.get(dateStr);

      let phase = 'normal';
      let isPeriod = false;
      let isFertile = false;
      let isOvulation = false;

      if (cycle) {
        const d1 = new Date(dateStr);
        d1.setHours(0, 0, 0, 0);
        const d2 = new Date(cycle.lastPeriodDate);
        d2.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays >= 1 && diffDays <= cycle.avgPeriodLength) {
          phase = 'menstruacion';
          isPeriod = true;
        }

        const ovulationDay = cycle.avgCycleLength - 14;
        if (diffDays >= 11 && diffDays <= 16) {
          isFertile = true;
          if (diffDays === ovulationDay) {
            phase = 'ovulacion';
            isOvulation = true;
          } else {
            phase = 'fertil';
          }
        } else if (diffDays > cycle.avgCycleLength - 7 && diffDays <= cycle.avgCycleLength) {
          phase = 'lutea';
        } else if (diffDays > cycle.avgPeriodLength && diffDays < 11) {
          phase = 'folicular';
        }
      }

      days.push({
        date: dateStr,
        day,
        phase,
        isPeriod,
        isFertile,
        isOvulation,
        energy: log?.energy || null,
        flow: log?.flow || null,
        mood: log?.mood || null,
        symptoms: log?.symptoms ? log.symptoms.split(',').map(s => s.trim()) : [],
        intercourse: log?.intercourse ?? null,
        protected: log?.protected ?? null,
        notes: log?.notes || null,
      });
    }

    return { year, month, days, cycleLength: cycle?.avgCycleLength || 28 };
  }

  async logDay(userId: number, data: {
    date: string;
    flow?: string;
    energy?: string;
    mood?: string;
    painLevel?: string;
    skin?: string;
    sleep?: string;
    symptoms?: string[];
    intercourse?: boolean;
    protected?: boolean;
    notes?: string;
  }) {
    const existing = await this.cycleLogRepository.findOne({
      where: { user: { id: userId }, date: data.date },
    });

    if (existing) {
      if (data.flow !== undefined) existing.flow = data.flow;
      if (data.energy !== undefined) existing.energy = data.energy;
      if (data.mood !== undefined) existing.mood = data.mood;
      if (data.painLevel !== undefined) existing.painLevel = data.painLevel;
      if (data.skin !== undefined) existing.skin = data.skin;
      if (data.sleep !== undefined) existing.sleep = data.sleep;
      if (data.symptoms !== undefined) existing.symptoms = data.symptoms.join(', ');
      if (data.intercourse !== undefined) existing.intercourse = data.intercourse;
      if (data.protected !== undefined) existing.protected = data.protected;
      if (data.notes !== undefined) existing.notes = data.notes;
      await this.cycleLogRepository.save(existing);
      return { success: true, id: existing.id };
    }

    const log = this.cycleLogRepository.create({
      date: data.date,
      flow: data.flow,
      energy: data.energy,
      mood: data.mood,
      painLevel: data.painLevel,
      skin: data.skin,
      sleep: data.sleep,
      symptoms: data.symptoms?.join(', '),
      intercourse: data.intercourse,
      protected: data.protected,
      notes: data.notes,
      user: { id: userId } as User,
    });
    await this.cycleLogRepository.save(log);
    return { success: true, id: log.id };
  }

  async setPeriodDate(userId: number, data: { date: string }) {
    const user = { id: userId } as User;
    const existing = await this.cycleRepository.findOne({
      where: { user },
      order: { lastPeriodDate: 'DESC' },
    });

    if (existing) {
      existing.lastPeriodDate = data.date;
      await this.cycleRepository.save(existing);
    } else {
      const newCycle = this.cycleRepository.create({ lastPeriodDate: data.date, user });
      await this.cycleRepository.save(newCycle);
    }

    // Auto-log the period for avgPeriodLength days
    const cycle = await this.getCurrentCycle(userId);
    for (let i = 0; i < (cycle?.avgPeriodLength || 5); i++) {
      const d = new Date(data.date);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const existingLog = await this.cycleLogRepository.findOne({
        where: { user: { id: userId }, date: dateStr },
      });
      if (!existingLog) {
        const log = this.cycleLogRepository.create({
          date: dateStr,
          flow: i === 0 ? 'fuerte' : i <= 2 ? 'moderado' : 'leve',
          user: { id: userId } as User,
        });
        await this.cycleLogRepository.save(log);
      }
    }

    return { success: true };
  }

  async getStats(userId: number) {
    const cycles = await this.cycleRepository.find({
      where: { user: { id: userId } },
      order: { lastPeriodDate: 'DESC' },
    });

    const logs = await this.cycleLogRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
      take: 30,
    });

    const intercourseCount = logs.filter(l => l.intercourse).length;
    const avgEnergy = logs.filter(l => l.energy).reduce((acc, l) => {
      const val = l.energy === 'alta' ? 3 : l.energy === 'media' ? 2 : 1;
      return acc + val;
    }, 0) / Math.max(1, logs.filter(l => l.energy).length);

    return {
      trackedDays: logs.length,
      intercourseCount,
      avgEnergy: avgEnergy ? Math.round(avgEnergy * 10) / 10 : 0,
      totalCycles: cycles.length,
    };
  }

  async logCycle(userId: number, data: { startDate: string; endDate?: string; symptoms?: string[]; mood?: string; notes?: string }) {
    // 1. Establecer la fecha de inicio del periodo
    await this.setPeriodDate(userId, { date: data.startDate });
    
    // 2. Guardar los detalles adicionales en el log de ese día específico
    return await this.logDay(userId, {
      date: data.startDate,
      mood: data.mood,
      symptoms: data.symptoms,
      notes: data.notes,
    });
  }

  private getPhase(diffDays: number, avgPeriodLength: number, avgCycleLength: number): string {
    if (diffDays <= avgPeriodLength) return 'Menstrual';
    if (diffDays >= 11 && diffDays <= 16) return 'Ovulatoria';
    if (diffDays > 16 && diffDays <= avgCycleLength) return 'Lútea';
    return 'Folicular';
  }
}
