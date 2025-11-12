"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true
    });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.setGlobalPrefix('api');
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', { infer: true }) ?? 3001;
    await app.listen(port);
    const logger = new common_1.Logger('Bootstrap');
    logger.log(`API listening on http://localhost:${port}`);
}
void bootstrap();
