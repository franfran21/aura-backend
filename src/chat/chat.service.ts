import { Injectable } from '@nestjs/common';
import { AiClient } from '../ai-engine/ai.client';
import { CycleService } from '../cycle/cycle.service';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable()
export class ChatService {
  constructor(
    private readonly aiClient: AiClient,
    private readonly cycleService: CycleService,
  ) {}

  private conversations: Map<number, Message[]> = new Map();
  private readonly MAX_HISTORY = 10;

  async processMessage(userId: number, userMessage: string): Promise<{ response: string; phase: string; timestamp: string }> {
    const cycleData = await this.cycleService.getCurrentCycle(userId);
    let contextBlock = '';

    if (cycleData) {
      // Intentar obtener sÃ­ntomas y datos recientes (Ãºltimos 3 dÃ­as)
      // Por brevedad, usamos los datos actuales del ciclo
      contextBlock = `
[CONTEXTO DEL CICLO DE LA USUARIA - NO MENCIONAR DIRECTAMENTE A MENOS QUE SEA RELEVANTE]
Día del ciclo: ${cycleData.currentDay} de ${cycleData.avgCycleLength}
Fase actual: ${cycleData.phase}
Último periodo: ${cycleData.lastPeriodDate}
Próxima ovulación estimada: dÃ­a ${cycleData.ovulationDay} del ciclo
Próximo periodo estimado: ${cycleData.nextPeriodDate}
[FIN CONTEXTO]

Mensaje de la usuaria: ${userMessage}
`;
    } else {
      contextBlock = `
[La usuaria aún no ha registrado su ciclo. Si es relevante, puedes preguntarle amablemente.]

Mensaje de la usuaria: ${userMessage}
`;
    }

    const history = this.getOrCreateHistory(userId);
    
    // Si es el primer mensaje, el primer elemento lleva el contexto
    // Si no, solo el último mensaje del usuario lleva el contexto actual
    const messageForAi: Message = {
      role: 'user',
      parts: [{ text: contextBlock }]
    };

    history.push(messageForAi);

    const response = await this.aiClient.dispatchChat(history);

    history.push({
      role: 'model',
      parts: [{ text: response }]
    });

    this.trimHistory(userId);

    return {
      response,
      phase: cycleData?.phase || 'Desconocida',
      timestamp: new Date().toISOString()
    };
  }

  private getOrCreateHistory(userId: number): Message[] {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }
    return this.conversations.get(userId)!;
  }

  private trimHistory(userId: number) {
    const history = this.conversations.get(userId);
    if (history && history.length > this.MAX_HISTORY) {
      // Mantener el primer mensaje (que puede tener contexto inicial) o simplemente borrar los antiguos
      // Siguiendo la instrucción: "elimina los más antiguos pero SIEMPRE mantén el primero"
      const first = history[0];
      const lastN = history.slice(-(this.MAX_HISTORY - 1));
      this.conversations.set(userId, [first, ...lastN]);
    }
  }

  clearHistory(userId: number) {
    this.conversations.delete(userId);
  }
}
