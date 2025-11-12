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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeraController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const supabase_service_1 = require("../supabase/supabase.service");
const vera_service_1 = require("./vera.service");
class ChatDto {
}
let VeraController = class VeraController {
    constructor(veraService, supabaseService) {
        this.veraService = veraService;
        this.supabaseService = supabaseService;
    }
    async health() {
        const isHealthy = await this.veraService.healthCheck();
        return {
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString()
        };
    }
    async chat(req, body) {
        const { conversationId, message } = body;
        const userId = req.user?.id ?? 'anonymous-user';
        const accessToken = req.user?.accessToken;
        const supabase = this.supabaseService.getClient(accessToken);
        const response = await this.veraService.chatWithContext(userId, conversationId, message, supabase);
        return {
            message: response,
            timestamp: new Date().toISOString()
        };
    }
};
exports.VeraController = VeraController;
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VeraController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChatDto]),
    __metadata("design:returntype", Promise)
], VeraController.prototype, "chat", null);
exports.VeraController = VeraController = __decorate([
    (0, common_1.Controller)('vera'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [vera_service_1.VeraService,
        supabase_service_1.SupabaseService])
], VeraController);
