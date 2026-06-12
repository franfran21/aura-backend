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
        this.SYSTEM_PROMPT = `Eres Luna, la asistente de inteligencia artificial de AuraHealth+, 
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
    }
    async dispatchAnalysis(payload, phase) {
        return this.dispatchChat([{ role: 'user', content: payload }]);
    }
    async dispatchChat(contents) {
        var _a, _b, _c;
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return "Hola! Estoy teniendo un momento de descanso, pero vuelvo enseguida. ¿Puedes intentarlo de nuevo en un momento?";
        }
        let prompt = '';
        if (contents.length === 1) {
            prompt = contents[0].content || ((_b = (_a = contents[0].parts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || '';
        }
        else {
            prompt = contents.map(item => {
                var _a, _b;
                const role = item.role === 'model' || item.role === 'assistant' ? 'Luna' : 'Usuaria';
                const text = item.content || ((_b = (_a = item.parts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || '';
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
            const response = await axios_1.default.post(groqUrl, body, {
                headers: {
                    'Authorization': 'Bearer ' + apiKey,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            });
            return response.data.choices[0].message.content;
        }
        catch (error) {
            console.error('Groq Error:', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
            return "Hola! Estoy teniendo un momento de descanso, pero vuelvo enseguida. ¿Puedes intentarlo de nuevo en un momento?";
        }
    }
};
exports.AiClient = AiClient;
exports.AiClient = AiClient = __decorate([
    (0, common_1.Injectable)()
], AiClient);
//# sourceMappingURL=ai.client.js.map