"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middlewares/errorHandler");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./lib/constants");
const project_router_1 = __importDefault(require("./routers/project.router"));
const invitation_router_1 = __importDefault(require("./routers/invitation.router"));
const comment_router_1 = __importDefault(require("./routers/comment.router"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const task_router_1 = __importDefault(require("./routers/task.router"));
const subtask_router_1 = __importDefault(require("./routers/subtask.router"));
const file_router_1 = __importDefault(require("./routers/file.router"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     allowedHeaders: ['Content-Type', 'Authorization']
//   })
// );
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/tasks', task_router_1.default);
app.use('/projects', project_router_1.default);
app.use('/invitations', invitation_router_1.default);
app.use('/comments', comment_router_1.default);
app.use('/auth', auth_router_1.default);
app.use('/users', user_router_1.default);
app.use('/subtasks', subtask_router_1.default);
app.use('/files', file_router_1.default);
app.use(errorHandler_1.defaultNotFoundHandler);
app.use(errorHandler_1.globalErrorHandler);
app.listen(constants_1.PORT, () => console.log('Server Start'));
