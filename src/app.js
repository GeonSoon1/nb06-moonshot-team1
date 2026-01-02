import express from 'express';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';
import { PORT } from './lib/constants.js';
import projectRouter from './routers/project.router.js';
import memberRouter from './routers/member.router.js';
import commentRouter from './routers/comment.router.js';
import cors from 'cors';
import authRouter from './routers/auth.router.js';
import userRouter from './routers/user.router.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

app.use('/', memberRouter);
app.use('/projects', projectRouter);

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use('/', commentRouter);
app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Start'));
