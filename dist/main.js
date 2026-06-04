"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('\x1b[35m%s\x1b[0m', `
  #####################################################################
  #   AURAHEALTH+ HYBRID AI ECOSYSTEM | SISTEMA INDUSTRIAL            #
  #   DESARROLLADO Y FIRMADO POR: FRANCYS ALVARADO                    #
  #####################################################################
  `);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map