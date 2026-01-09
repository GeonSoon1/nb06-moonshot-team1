import express from 'express';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { PORT } from './lib/constants';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler';
import projectRouter from './routers/project.router';
import invitationRouter from './routers/invitation.router';
import commentRouter from './routers/comment.router';
import authRouter from './routers/auth.router';
import userRouter from './routers/user.router';
import taskRouter from './routers/task.router';
import subtaskRouter from './routers/subtask.router';
import fileRouter from './routers/file.router';

const app = express();

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     allowedHeaders: ['Content-Type', 'Authorization']
//   })
// );
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/docs.json', (req, res) => res.json(swaggerSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use('/projects', projectRouter);
app.use('/invitations', invitationRouter);
app.use('/comments', commentRouter);

app.use('/tasks', taskRouter);
app.use('/files', fileRouter);

app.use('/subtasks', subtaskRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Start'));
