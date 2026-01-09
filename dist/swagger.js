"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
// swagger.js
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation'
        },
        servers: [{ url: 'http://localhost:3000', description: 'local' }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ bearerAuth: [] }] // 글로벌하게 인증
    },
    apis: [path_1.default.join(process.cwd(), 'dist', 'routers', '**', '*.js')]
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
