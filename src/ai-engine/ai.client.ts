import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiClient {
  private readonly ollamaUrl = 'http://localhost:11434/api/generate';
  private readonly modelName = 'llama3'; // Puedes cambiarlo a 'mistral' o el que tengas

  async dispatchAnalysis(payload: string, phase?: string): Promise<string> {
    const prompt = `
      Actúa como un experto en salud femenina y biohacking. 
      Analiza las siguientes métricas de la usuaria: ${payload}
      Fase del ciclo actual: ${phase || 'Desconocida'}

      Proporciona un diagnóstico corto (máximo 3 frases) y un consejo práctico.
      Mantén un tono profesional, empoderador y científico.
      Respuesta en Español.
    `;

    try {
      const response = await axios.post(this.ollamaUrl, {
        model: this.modelName,
        prompt: prompt,
        stream: false,
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama Error:', error.message);
      return `[AURAHEALTH+ AI OFFLINE] - Estabilidad hormonal detectada. Fase: ${phase || 'N/D'}. Metrics: ${payload}`;
    }
  }
}
