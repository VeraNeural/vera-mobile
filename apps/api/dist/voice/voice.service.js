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
var VoiceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let VoiceService = VoiceService_1 = class VoiceService {
    constructor(http, configService) {
        this.http = http;
        this.configService = configService;
        this.logger = new common_1.Logger(VoiceService_1.name);
        this.elevenLabsKey = this.configService.getOrThrow('ELEVENLABS_API_KEY');
        this.defaultVoiceId = this.configService.getOrThrow('ELEVENLABS_VOICE_ID');
        this.defaultModelId = this.configService.getOrThrow('ELEVENLABS_MODEL_ID');
    }
    async synthesizeText({ text, voiceId }) {
        const targetVoice = voiceId ?? this.defaultVoiceId;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.http.post(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`, {
                text,
                model_id: this.defaultModelId,
                voice_settings: {
                    stability: 0.62,
                    similarity_boost: 0.75
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.elevenLabsKey
                },
                responseType: 'arraybuffer'
            }));
            const audioBuffer = Buffer.from(response.data);
            return {
                voiceId: targetVoice,
                modelId: this.defaultModelId,
                mimeType: 'audio/mpeg',
                audioBase64: audioBuffer.toString('base64'),
                size: audioBuffer.length
            };
        }
        catch (error) {
            this.logger.error('Failed to synthesize audio with ElevenLabs', error instanceof Error ? error.stack : error);
            throw new common_1.InternalServerErrorException('Unable to synthesize voice preview');
        }
    }
};
exports.VoiceService = VoiceService;
exports.VoiceService = VoiceService = VoiceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService, config_1.ConfigService])
], VoiceService);
