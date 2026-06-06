import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiClient {
  private readonly apiKey = process.env.GOOGLE_API_KEY;

  async dispatchAnalysis(payload: string, phase?: string): Promise<string> {
    if (!this.apiKey) {
      console.warn('GOOGLE_API_KEY no configurada. Usando modo fallback.');
      return `[AURAHEALTH+ AI] - Estabilidad hormonal detectada en fase ${phase || 'N/D'}. Sigue con tu rutina actual.`;
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const prompt = `

      Eres Luna, la IA experta de AuraHealth+. Tu misión es empoderar a las mujeres analizando sus métricas hormonales.
      
      CONTEXTO DE LA USUARIA:
      - Fase del ciclo: ${phase || 'Desconocida'}
      - Datos registrados: ${payload}

      INSTRUCCIONES:
      1. Proporciona un análisis breve pero profundo (máximo 4 frases).
      2. Explica qué significa esto para su energía, piel o estado de ánimo según su fase.
      3. Da un consejo práctico e inmediato.
      4. Usa un tono cercano, científico y muy positivo.
      
      IMPORTANTE: No uses lenguaje genérico. Sé específica con los datos proporcionados.
      Responde siempre en Español.
    `;

    try {
      const response = await axios.post(geminiUrl, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      });

      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return aiResponse || "Luna está analizando tus datos. Por ahora, sigue escuchando a tu cuerpo.";
    } catch (error) {
      console.error('Gemini Error:', error.response?.data || error.message);
      return `Hola! Estoy teniendo un pequeño problema técnico, pero basándome en tu fase ${phase || ''}, te recomiendo priorizar el descanso y una hidratación rica en electrolitos.`;
    }
  }
}
