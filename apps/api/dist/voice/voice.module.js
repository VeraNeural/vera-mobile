"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const voice_service_1 = require("./voice.service");
const voice_controller_1 = require("./voice.controller");
let VoiceModule = class VoiceModule {
};
exports.VoiceModule = VoiceModule;
exports.VoiceModule = VoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, axios_1.HttpModule.register({ timeout: 10_000 })],
        controllers: [voice_controller_1.VoiceController],
        providers: [voice_service_1.VoiceService],
        exports: [voice_service_1.VoiceService]
    })
], VoiceModule);
