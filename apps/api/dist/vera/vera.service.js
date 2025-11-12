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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var VeraService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeraService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let VeraService = VeraService_1 = class VeraService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(VeraService_1.name);
        const baseURL = this.configService.get('VERA_MODEL_SERVICE_URL', { infer: true }) ?? 'http://localhost:8000';
        this.veraClient = axios_1.default.create({
            baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.logger.log(`VERA service initialized with base URL ${baseURL}`);
    }
    async healthCheck() {
        try {
            const response = await this.veraClient.get('/health');
            return response.data.status === 'healthy' && Boolean(response.data.model_loaded);
        }
        catch (error) {
            this.logger.error('VERA health check failed', error instanceof Error ? error.stack : undefined);
            return false;
        }
    }
    async chat(messages, options) {
        const request = {
            messages,
            max_tokens: options?.maxTokens ?? 512,
            temperature: options?.temperature ?? 0.7
        };
        try {
            this.logger.debug(`Sending ${messages.length} messages to VERA model`);
            const response = await this.veraClient.post('/chat', request);
            this.logger.debug(`VERA response received with ${response.data.tokens_used} tokens`);
            return response.data.message;
        }
        catch (error) {
            this.logger.error('Error calling VERA service', error instanceof Error ? error.stack : undefined);
            if (axios_1.default.isAxiosError(error)) {
                if (error.response?.status === common_1.HttpStatus.SERVICE_UNAVAILABLE) {
                    throw new common_1.HttpException('VERA model service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
                }
                if (error.code === 'ECONNREFUSED') {
                    throw new common_1.HttpException('Cannot connect to VERA model service', common_1.HttpStatus.SERVICE_UNAVAILABLE);
                }
            }
            throw new common_1.HttpException('Failed to generate VERA response', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async chatWithContext(userId, conversationId, userMessage, supabase) {
        try {
            const { data, error: historyError } = await supabase
                .from('messages')
                .select('role, content')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true })
                .limit(10);
            if (historyError) {
                this.logger.error('Failed to fetch conversation history', historyError);
                throw new common_1.HttpException('Failed to fetch conversation history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const history = (data ?? []);
            const messages = [
                ...history.map((entry) => ({
                    role: entry.role,
                    content: entry.content
                })),
                {
                    role: 'user',
                    content: userMessage
                }
            ];
            const response = await this.chat(messages);
            const [userInsert, assistantInsert] = await Promise.all([
                supabase.from('messages').insert({
                    conversation_id: conversationId,
                    user_id: userId,
                    role: 'user',
                    content: userMessage
                }),
                supabase.from('messages').insert({
                    conversation_id: conversationId,
                    user_id: userId,
                    role: 'assistant',
                    content: response
                })
            ]);
            if (userInsert.error || assistantInsert.error) {
                this.logger.error('Failed to persist chat messages', userInsert.error ?? assistantInsert.error);
                throw new common_1.HttpException('Failed to persist chat messages', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return response;
        }
        catch (error) {
            this.logger.error('Error while processing contextual chat', error instanceof Error ? error.stack : undefined);
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException('Failed to generate contextual VERA response', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.VeraService = VeraService;
exports.VeraService = VeraService = VeraService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VeraService);
