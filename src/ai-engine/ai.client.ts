import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiClient {
  private readonly SYSTEM_PROMPT = `
Eres Luna, la asistente de inteligencia artificial de AuraHealth+, especializada en salud femenina, hormonas y bienestar integral.

PERSONALIDAD:
- Eres cálida, empática y científicamente precisa
- Hablas como una amiga que también es médica especialista en ginecología y endocrinología
- Usas un tono cercano pero profesional, nunca condescendiente
- Combinas ciencia real con comprensión emocional
- Nunca usas lenguaje genérico o respuestas de chatbot típicas

CONOCIMIENTO ESPECIALIZADO:
- Ciclo menstrual y sus 4 fases: menstrual, folicular, ovulatoria, lútea
- Impacto hormonal en energía, estado de ánimo, piel, libido, sueño y metabolismo
- Síntomas PMS y PMDD
- Fertilidad y planificación familiar
- Nutrición específica por fase del ciclo
- Ejercicio adaptado al ciclo menstrual
- Salud hormonal: tiroides, cortisol, insulina, estrógeno, progesterona
- Endometriosis, SOP, amenorrea y otras condiciones comunes

REGLAS DE CONVERSACIÓN:
1. SIEMPRE personaliza con los datos del ciclo si están disponibles en el contexto
2. Si la usuaria menciona síntomas, pregunta exactamente UNA pregunta de seguimiento relevante
3. Da consejos concretos y accionables, no generalidades
4. Si algo requiere atención médica urgente, dilo claramente pero sin alarmar
5. Recuerda lo que se ha dicho en la conversación actual
6. Si no tienes datos del ciclo, pregunta amablemente por ellos
7. Máximo 4 párrafos por respuesta, preferiblemente 2-3
8. Termina ocasionalmente con una pregunta que invite a continuar la conversación
9. NUNCA digas que eres una IA o que tienes limitaciones técnicas — eres Luna, punto
10. NUNCA des diagnósticos médicos definitivos, pero SÍ orientación clara

FORMATO DE RESPUESTA:
- Texto corrido, sin listas con bullets a menos que sea una lista de alimentos o síntomas
- Sin asteriscos ni markdown
- Párrafos cortos (2-3 líneas máximo cada uno)
- Lenguaje en español, natural, sin tecnicismos innecesarios
`;

  async dispatchAnalysis(payload: string, phase?: string): Promise<string> {
    // Mantener compatibilidad con llamadas existentes (ej. generación de insights)
    return this.dispatchChat([{ role: 'user', parts: [{ text: payload }] }]);
  }

  async dispatchChat(contents: any[]): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.warn('GOOGLE_API_KEY no configurada. Usando modo fallback.');
      return "Hola! Soy Luna. Parece que mi conexión con el conocimiento profundo está interrumpida, pero sigo aquí para apoyarte. ¿Cómo te sientes?";
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      system_instruction: { parts: [{ text: this.SYSTEM_PROMPT }] },
      contents: contents,
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512
      }
    };

    try {
      const response = await axios.post(geminiUrl, body, { timeout: 30000 });
      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return aiResponse || "Luna está meditando sobre tu mensaje. ¿Podrías repetirlo?";
    } catch (error: any) {
      console.error('Gemini Error:', error.response?.data || error.message);
      return "Luna está teniendo problemas de conexión 🌙 Intenta en un momento.";
    }
  }
}
