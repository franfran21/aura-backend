import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CycleService } from '../cycle/cycle.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly cycleService: CycleService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('predictions')
  async getPredictions(@Request() req) {
    const userId = req.user.sub;
    const cycle = await this.cycleService.getCurrentCycle(userId);
    const stats = await this.cycleService.getStats(userId);
    const totalCycles = stats.totalCycles;

    // Si no hay ciclo, enviamos datos base por defecto
    if (!cycle) {
      return {
        energyLevel: 50,
        factors: [
          { label: 'Estrógeno', value: 'Pendiente de registro', color: '#F2C4D0' },
          { label: 'Progesterona', value: 'Pendiente de registro', color: '#534AB7' },
          { label: 'Fase', value: 'Desconocida', color: '#8B2252' }
        ],
        recommendation: 'Registra tu último periodo para que Luna pueda predecir tus niveles hormonales.',
        nextPeriodDate: 'Pendiente',
        ovulationWindow: 'Pendiente',
        highEnergyDays: 'Pendiente',
        pregnancyProbability: 'Desconocida',
        hasEnoughData: false,
        cyclesRegistered: 0
      };
    }

    // Lógica de predicción basada en el día del ciclo
    let energy = 50;
    let factors = [];
    let recommendation = '';

    if (cycle.phase === 'Menstrual') {
      energy = 30;
      factors = [
        { label: 'Estrógeno', value: 'Nivel bajo', color: '#F2C4D0' },
        { label: 'Progesterona', value: 'Nivel bajo', color: '#534AB7' },
        { label: 'Hierro', value: 'Necesidad alta', color: '#8B2252' }
      ];
      recommendation = 'Tu cuerpo está en modo limpieza. Prioriza el descanso profundo y alimentos ricos en hierro.';
    } else if (cycle.phase === 'Folicular') {
      energy = 70;
      factors = [
        { label: 'Estrógeno', value: 'En ascenso', color: '#F2C4D0' },
        { label: 'Testosterona', value: 'Subiendo', color: '#8B2252' },
        { label: 'Energía', value: 'Alta', color: '#4CAF50' }
      ];
      recommendation = 'Tus estrógenos están subiendo. Es el mejor momento para iniciar proyectos y actividad física intensa.';
    } else if (cycle.phase === 'Ovulatoria') {
      energy = 95;
      factors = [
        { label: 'Estrógeno', value: 'Pico máximo', color: '#F2C4D0' },
        { label: 'LH', value: 'Pico de ovulación', color: '#8B2252' },
        { label: 'Libido', value: 'Muy alta', color: '#C0527A' }
      ];
      recommendation = 'Estás en tu punto máximo de energía y sociabilidad. ¡Aprovéchalo!';
    } else { // Lútea
      energy = 55;
      factors = [
        { label: 'Progesterona', value: 'Pico máximo', color: '#534AB7' },
        { label: 'Estrógeno', value: 'En descenso', color: '#F2C4D0' },
        { label: 'Metabolismo', value: 'Acelerado', color: '#FF9800' }
      ];
      recommendation = 'La progesterona domina. Es normal sentir más hambre y necesidad de calma. Escucha a tu cuerpo.';
    }

    // Calcular próxima fecha de período
    const nextPeriodDate = cycle.nextPeriodDate;

    // Calcular próxima ventana de ovulación
    const lastPeriod = new Date(cycle.lastPeriodDate);
    let targetPeriod = new Date(lastPeriod);
    
    // Si la ventana fértil actual ya pasó, calculamos para el próximo ciclo
    if (cycle.currentDay > cycle.fertileWindow.end) {
      targetPeriod.setDate(lastPeriod.getDate() + cycle.avgCycleLength);
    }
    
    const fertileStart = new Date(targetPeriod);
    fertileStart.setDate(targetPeriod.getDate() + cycle.fertileWindow.start - 1);
    const fertileEnd = new Date(targetPeriod);
    fertileEnd.setDate(targetPeriod.getDate() + cycle.fertileWindow.end - 1);
    
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formatCustomDate = (d: Date) => `${d.getDate()} de ${months[d.getMonth()]}`;
    const ovulationWindow = `${formatCustomDate(fertileStart)} - ${formatCustomDate(fertileEnd)}`;

    // Días con más energía: Días 6 al 16 del ciclo (Fase Folicular y Ovulatoria)
    const highEnergyDays = 'Días 6 al 16 de tu ciclo';

    // Probabilidad de embarazo por día
    let pregnancyProbability = 'Baja';
    const currentDay = cycle.currentDay;
    if (currentDay >= cycle.fertileWindow.start && currentDay <= cycle.fertileWindow.end) {
      pregnancyProbability = 'Alta';
    } else if (
      Math.abs(currentDay - cycle.fertileWindow.start) <= 2 || 
      Math.abs(currentDay - cycle.fertileWindow.end) <= 2
    ) {
      pregnancyProbability = 'Media';
    }

    // Se necesitan al menos 2 ciclos para tener predicciones personalizadas precisas
    const hasEnoughData = totalCycles >= 2;

    return {
      energyLevel: energy,
      factors,
      recommendation,
      phase: cycle.phase,
      currentDay: cycle.currentDay,
      nextPeriodDate,
      ovulationWindow,
      highEnergyDays,
      pregnancyProbability,
      hasEnoughData,
      cyclesRegistered: totalCycles
    };
  }
}
