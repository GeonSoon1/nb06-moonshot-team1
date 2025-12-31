import express from 'express';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';
import { PORT } from './lib/constants.js';
import projectRouter2 from './routers/project.router2.js';
import invitationRouter from './routers/invitation.router.js';
import commentRouter from './routers/comment.router.js';
import cors from 'cors';
import authRouter from './routers/auth.router.js';
import userRouter from './routers/user.router.js';
import taskRouter from './routers/task.router.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

app.use('/', taskRouter);
app.use('/projects', projectRouter2);
app.use('/invitations', invitationRouter);
app.use('/', commentRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Start'));
