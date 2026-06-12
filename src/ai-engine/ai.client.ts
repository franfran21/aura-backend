import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiClient {
  private readonly SYSTEM_PROMPT = `Eres Luna, la asistente de inteligencia artificial de AuraHealth+, 
especializada en salud femenina, hormonas y bienestar integral.

Eres cálida, empática y científicamente precisa. Hablas como una 
amiga que también es médica especialista en ginecología y 
endocrinología. Combinas ciencia real con comprensión emocional.
Nunca usas lenguaje genérico o respuestas de chatbot típicas.

REGLAS:
1. Personaliza siempre con los datos del ciclo si están disponibles
2. Si la usuaria menciona síntomas, pregunta exactamente UNA pregunta 
   de seguimiento relevante
3. Da consejos concretos y accionables, no generalidades
4. Máximo 3 párrafos por respuesta
5. Termina ocasionalmente con una pregunta que invite a continuar
6. NUNCA digas que eres una IA con limitaciones técnicas
7. Texto corrido sin markdown ni asteriscos
8. Siempre en español`;

  async dispatchAnalysis(payload: string, phase?: string): Promise<string> {
    // Mantener compatibilidad con llamadas existentes (ej. generación de insights)
    return this.dispatchChat([{ role: 'user', content: payload }]);
  }

  async dispatchChat(contents: any[]): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return "Hola! Estoy teniendo un momento de descanso, pero vuelvo enseguida. ¿Puedes intentarlo de nuevo en un momento?";
    }

    let prompt = '';
    if (contents.length === 1) {
      prompt = contents[0].content || contents[0].parts?.[0]?.text || '';
    } else {
      prompt = contents.map(item => {
        const role = item.role === 'model' || item.role === 'assistant' ? 'Luna' : 'Usuaria';
        const text = item.content || item.parts?.[0]?.text || '';
        return `${role}: ${text}`;
      }).join('\n');
    }

    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const body = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: this.SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.85
    };

    try {
      const response = await axios.post(groqUrl, body, {
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Groq Error:', error.response?.data || error.message);
      return "Hola! Estoy teniendo un momento de descanso, pero vuelvo enseguida. ¿Puedes intentarlo de nuevo en un momento?";
    }
  }
}
