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
let AiClient = class AiClient {
    async callLLM(prompt) {
        return JSON.stringify({
            title: "Optimiza tu Energía Folicular",
            description: "Tus niveles de HRV y sueño profundo están en un rango ideal hoy. Aprovecha el pico natural de estrógenos de tu fase folicular para entrenamientos de alta intensidad y actividades de alta demanda cognitiva."
        });
    }
};
exports.AiClient = AiClient;
exports.AiClient = AiClient = __decorate([
    (0, common_1.Injectable)()
], AiClient);
//# sourceMappingURL=ai.client.js.map