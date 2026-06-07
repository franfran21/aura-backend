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
    
    // Si no hay ciclo, enviamos datos base por defecto
    if (!cycle) {
      return {
        energyLevel: 50,
        factors: [
          { label: 'Estrógeno', value: 'Pendiente de registro', color: '#F2C4D0' },
          { label: 'Progesterona', value: 'Pendiente de registro', color: '#534AB7' },
          { label: 'Fase', value: 'Desconocida', color: '#8B2252' }
        ],
        recommendation: 'Registra tu último periodo para que Luna pueda predecir tus niveles hormonales.'
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

    return {
      energyLevel: energy,
      factors,
      recommendation,
      phase: cycle.phase,
      currentDay: cycle.currentDay
    };
  }
}
