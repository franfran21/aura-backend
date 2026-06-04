"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiClient = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let AiClient = class AiClient {
    constructor() {
        this.ollamaUrl = 'http://localhost:11434/api/generate';
        this.modelName = 'llama3';
    }
    async dispatchAnalysis(payload, phase) {
        const prompt = `
      Actúa como un experto en salud femenina y biohacking. 
      Analiza las siguientes métricas de la usuaria: ${payload}
      Fase del ciclo actual: ${phase || 'Desconocida'}

      Proporciona un diagnóstico corto (máximo 3 frases) y un consejo práctico.
      Mantén un tono profesional, empoderador y científico.
      Respuesta en Español.
    `;
        try {
            const response = await axios_1.default.post(this.ollamaUrl, {
                model: this.modelName,
                prompt: prompt,
                stream: false,
            });
            return response.data.response;
        }
        catch (error) {
            console.error('Ollama Error:', error.message);
            return `[AURAHEALTH+ AI OFFLINE] - Estabilidad hormonal detectada. Fase: ${phase || 'N/D'}. Metrics: ${payload}`;
        }
    }
};
exports.AiClient = AiClient;
exports.AiClient = AiClient = __decorate([
    (0, common_1.Injectable)()
], AiClient);
//# sourceMappingURL=ai.client.js.map