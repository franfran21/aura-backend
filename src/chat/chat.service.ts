import { Injectable } from '@nestjs/common';
import { AiClient } from '../ai-engine/ai.client';

interface ConversationMemory {
  userId: number;
  messages: { role: 'user' | 'assistant'; content: string }[];
  timestamp: Date;
}

@Injectable()
export class ChatService {
  constructor(private readonly aiClient: AiClient) {}

  private conversations: Map<number, ConversationMemory> = new Map();
  private readonly MAX_HISTORY = 10;

  async processMessage(userId: number, message: string, phase?: string): Promise<{ response: string; phase?: string }> {
    const memory = this.getOrCreateMemory(userId);
    memory.messages.push({ role: 'user', content: message });
    
    // Preparar el contexto histórico para la IA
    const historyContext = memory.messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const fullContext = `HISTORIAL:\n${historyContext}\n\nMENSAJE ACTUAL: ${message}`;

    const response = await this.aiClient.dispatchAnalysis(fullContext, phase || 'Desconocida');

    memory.messages.push({ role: 'assistant', content: response });
    this.trimMemory(memory);

    return { response, phase: phase || 'Desconocida' };
  }

  private getOrCreateMemory(userId: number): ConversationMemory {
    let mem = this.conversations.get(userId);
    if (!mem || (Date.now() - mem.timestamp.getTime()) > 3600000) {
      mem = { userId, messages: [], timestamp: new Date() };
      this.conversations.set(userId, mem);
    }
    return mem;
  }

  private trimMemory(memory: ConversationMemory) {
    while (memory.messages.length > this.MAX_HISTORY) {
      memory.messages.shift();
    }
  }

  private detectIntent(msg: string): string {
    const lower = msg.toLowerCase();
    if (/hola|buenos\s*(dias|tardes|noches)|hey|saludos|buenas/.test(lower)) return 'saludo';
    if (/dolor|calambre|hinchazon|acne|fatiga|nausea|sintoma|molestia|cabeza|seno/.test(lower)) return 'sintoma';
    if (/ciclo|periodo|menstruacion|regla|dia\s*\d+|fase/.test(lower)) return 'ciclo';
    if (/energia|energía|vitalidad|cansancio|agotada|sin\s*energia/.test(lower)) return 'energia';
    if (/animo|ánimo|triste|alegre|irritable|estres|ansiedad|emocion/.test(lower)) return 'estado_animo';
    if (/consejo|recomienda|que\s*puedo|ayuda|sugerencia|que\s*hacer/.test(lower)) return 'consejo';
    if (/ovulacion|ovulación|fertil|embarazo|quedar|concebir|baby/.test(lower)) return 'fertilidad';
    if (/relacion|sexo|intercurso|proteccion|cuidarme|cuidaron/.test(lower)) return 'sexual';
    if (/gracias|bye|chao|adios|nos\s*vemos/.test(lower)) return 'despedida';
    return 'general';
  }

  private generateResponse(intent: string, msg: string, phase: string, memory: ConversationMemory): string {
    const userName = this.extractName(msg);

    const phaseAdvice: Record<string, { desc: string; tips: string[] }> = {
      'Menstrual': {
        desc: 'Estás en tu fase menstrual. Es un momento de introspección y descanso.',
        tips: ['Prioriza el descanso y el autocuidado', 'Consume alimentos ricos en hierro como espinacas y legumbres', 'Ejercicio suave como yoga o caminatas', 'Mantente hidratada con infusiones calientes'],
      },
      'Folicular': {
        desc: 'Estás en tu fase folicular. Tus niveles de energía están aumentando.',
        tips: ['Aprovecha para hacer ejercicio de intensidad moderada', 'Es un buen momento para iniciar nuevos proyectos', 'Tu piel puede estar más radiante', 'La creatividad está en su punto alto'],
      },
      'Ovulatoria': {
        desc: 'Estás en tu fase ovulatoria. Es tu ventana fértil y te sientes más sociable.',
        tips: ['Tu comunicación y confianza están en su punto máximo', 'Si buscas embarazo, este es el momento óptimo', 'Tu energía está al máximo', 'Aprovecha para actividades sociales'],
      },
      'Lútea': {
        desc: 'Estás en tu fase lútea. Pueden aparecer síntomas premenstruales.',
        tips: ['Puedes experimentar antojos - escoge opciones saludables', 'La paciencia y el autocuidado son clave', 'Ejercicio moderado ayuda con la hinchazón', 'Prioriza un buen descanso'],
      },
    };

    const pa = phaseAdvice[phase] || {
      desc: 'Tu cuerpo está en equilibrio. Sigue escuchando sus señales.',
      tips: ['Mantén una rutina constante', 'Escucha a tu cuerpo', 'La hidratación es fundamental'],
    };

    const greetings = [
      `¡Hola ${userName}! Encantada de hablar contigo. `,
      `¡Hey ${userName}! Qué bueno verte por aquí. `,
      `¡Hola! Siempre es un gusto saber de ti. `,
    ];

    const farewells = [
      '¡Cuídate mucho! Estoy aquí cuando me necesites.',
      'Hasta luego. Recuerda que puedes escribirme cuando quieras.',
      'Un abrazo virtual. No dudes en volver si tienes más dudas.',
    ];

    switch (intent) {
      case 'saludo': {
        const greet = greetings[Math.floor(Math.random() * greetings.length)];
        return `${greet}${pa.desc} ¿Cómo te sientes hoy?`;
      }

      case 'despedida': {
        return farewells[Math.floor(Math.random() * farewells.length)];
      }

      case 'sintoma': {
        const symptomResponses = [
          `Entiendo que tengas molestias. En fase ${phase.toLowerCase()}, es común experimentar ciertos síntomas. ${pa.tips[0]}. ¿Quieres que te sugiera algo específico para aliviarlo?`,
          `Lamento que no te sientas bien. Durante la fase ${phase.toLowerCase()}, tu cuerpo está pasando por cambios hormonales. ${pa.tips[1]}. Cuéntame más sobre lo que sientes.`,
          `Los síntomas que mencionas son normales en tu fase actual (${phase.toLowerCase()}). ${pa.tips[2]}. Si el dolor es muy intenso, te recomiendo consultar con tu médico.`,
        ];
        return symptomResponses[Math.floor(Math.random() * symptomResponses.length)];
      }

      case 'ciclo': {
        const cycleResponses = [
          `Actualmente estás en la fase **${phase}** de tu ciclo. ${pa.desc} El ciclo menstrual promedio dura 28 días, pero cada mujer es única. ¿Quieres que te explique más sobre esta fase?`,
          `Tu ciclo está en la fase **${phase}**. ${pa.desc} Es importante llevar un registro para conocer tus patrones. ¿Has notado cambios en estos días?`,
          `Según tus registros, estás en la fase **${phase}**. ${pa.tips[0]}. ¿Te gustaría saber qué esperar en los próximos días?`,
        ];
        return cycleResponses[Math.floor(Math.random() * cycleResponses.length)];
      }

      case 'energia': {
        const energyByPhase: Record<string, string> = {
          'Menstrual': 'Durante la menstruación es normal tener menos energía. Escucha a tu cuerpo y descansa cuando lo necesites.',
          'Folicular': '¡Tu energía está en aumento! Es el momento ideal para hacer ejercicio y empezar proyectos nuevos.',
          'Ovulatoria': 'Tu energía está en su punto máximo. Aprovecha para ser productiva y socializar.',
          'Lútea': 'En esta fase tu energía puede fluctuar. Alterna actividad con descanso según lo que sientas.',
        };
        return `${energyByPhase[phase] || 'Tu energía puede variar según tu ciclo.'} ${pa.tips[Math.floor(Math.random() * pa.tips.length)]}.`;
      }

      case 'estado_animo': {
        const moodByPhase: Record<string, string> = {
          'Menstrual': 'Es normal sentirte más sensible o introspectiva durante la menstruación. Permítete sentir sin juzgarte.',
          'Folicular': 'Tu estado de ánimo tiende a ser más positivo y optimista en esta fase. ¡Aprovéchalo!',
          'Ovulatoria': 'Te sientes más sociable y comunicativa. Es un excelente momento para conectar con otros.',
          'Lútea': 'En la fase lútea puedes experimentar cambios de humor debido a las fluctuaciones hormonales. Es normal y temporal.',
        };
        return `${moodByPhase[phase] || 'Tus emociones son válidas y forman parte de tu ciclo.'} ¿Quieres compartir más sobre cómo te sientes?`;
      }

      case 'consejo': {
        const tip = pa.tips[Math.floor(Math.random() * pa.tips.length)];
        return `Claro, aquí va un consejo para tu fase **${phase}**: ${tip}. Además, te recomiendo mantener una rutina de sueño regular y una alimentación balanceada. ¿Necesitas alguna recomendación más específica?`;
      }

      case 'fertilidad': {
        const fertilityResponses = [
          `En la fase **${phase}**, tu fertilidad varía. Si estás en la ventana ovulatoria (días 11-16 approx.), es cuando hay más probabilidades de concebir. Llevar un registro de tu ciclo te ayudará a conocer tus días fértiles.`,
          `La ovulación generalmente ocurre alrededor del día 14 de tu ciclo (en un ciclo de 28 días). Durante los días 11-16, estás en tu ventana fértil. ¿Quieres que te explique más sobre cómo identificar tu ovulación?`,
          `Conocer tu ciclo es poder. Durante la ventana fértil (unos 6 días al mes), las probabilidades de embarazo son más altas. Si no buscas embarazo, asegúrate de usar protección en esos días.`,
        ];
        return fertilityResponses[Math.floor(Math.random() * fertilityResponses.length)];
      }

      case 'sexual': {
        const sexualResponses = [
          `Es importante llevar un registro de tus relaciones para entender mejor tu ciclo y salud sexual. Recuerda siempre usar protección si no buscas embarazo. Durante la fase **${phase}**, ${phase === 'Ovulatoria' ? 'estás en tu ventana fértil, así que si no buscas embarazo, extremar precauciones.' : 'las probabilidades de embarazo son más bajas, pero siempre existe un riesgo.'}`,
          `Gracias por compartir eso conmigo. Llevar un registro de tu vida sexual te ayuda a entender mejor tu cuerpo. En fase **${phase}**, ${phase === 'Ovulatoria' ? 'tu fertilidad está en su punto máximo.' : 'tu fertilidad es menor, pero cada cuerpo es diferente.'} ¿Usas algún método anticonceptivo?`,
        ];
        return sexualResponses[Math.floor(Math.random() * sexualResponses.length)];
      }

      case 'general':
      default: {
        const generalResponses = [
          `Gracias por compartir eso conmigo, ${userName}. En tu fase **${phase}**, tu cuerpo está experimentando cambios hormonales significativos. ${pa.tips[Math.floor(Math.random() * pa.tips.length)]}. ¿Hay algo más en lo que pueda ayudarte?`,
          `Entiendo. Durante la fase **${phase}**, ${pa.desc.toLowerCase()} ${pa.tips[Math.floor(Math.random() * pa.tips.length)]}. Cuéntame más para poder ayudarte mejor.`,
          `Qué interesante lo que me cuentas. Relacionado con tu ciclo (fase **${phase}**), te sugiero: ${pa.tips[Math.floor(Math.random() * pa.tips.length)]}. ¿Cómo te suena eso?`,
        ];
        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }
    }
  }

  private extractName(msg: string): string {
    const match = msg.match(/me llamo\s+(\w+)|soy\s+(\w+)|mi nombre es\s+(\w+)/i);
    if (match) return match[1] || match[2] || match[3] || '';
    return '';
  }
}
