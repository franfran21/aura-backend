"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const ai_client_1 = require("./ai.client");
let AiService = class AiService {
    constructor(aiClient) {
        this.aiClient = aiClient;
    }
    async generateHormonalInsight(payload) {
        var _a;
        const prompt = `
Eres una IA médica experta en salud femenina, endocrinología y ginecología clínica. Genera un insight de bienestar diario suave, empático y estrictamente basado en la ciencia para la usuaria según sus métricas de salud y fase del ciclo.
DATOS DEL DÍA:
- Fecha: ${payload.date.toISOString()}
- Fase del Ciclo Menstrual: ${((_a = payload.cycle) === null || _a === void 0 ? void 0 : _a.phase) || 'Desconocida / No registrada'}
- Métricas Clínicas registradas hoy: ${JSON.stringify(payload.metrics)}
INSTRUCCIONES DE SALIDA OBLIGATORIAS:
Debes responder ÚNICAMENTE con un objeto JSON perfectamente estructurado y válido. No incluyas explicaciones textuales fuera del JSON, ni etiquetas de código markdown (como \`\`\`json). El esquema exacto debe ser:
{
  "title": "Título dinámico, empático y motivador de máximo 5 palabras.",
  "description": "Análisis e interpretación científica simplificada de la interacción de sus métricas con su fase hormonal actual. Máximo 3 oraciones."
}
`;
        const rawResponse = await this.aiClient.callLLM(prompt);
        try {
            const cleanedResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanedResponse);
            return {
                title: parsed.title || 'Insight Hormonal',
                description: parsed.description || cleanedResponse,
            };
        }
        catch (error) {
            return {
                title: 'Análisis de Bienestar',
                description: rawResponse.length > 20 ? rawResponse : 'Tu balance hormonal está evolucionando. Mantén un seguimiento continuo de tus métricas para un análisis detallado.',
            };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_client_1.AiClient])
], AiService);
//# sourceMappingURL=ai.service.js.map