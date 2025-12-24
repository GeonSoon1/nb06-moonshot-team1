import express from 'express';
import cookieParser from 'cookie-parser';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';
import { PORT } from './lib/constants.js';
import projectRouter from './routers/project.router.js';
import memberRouter from './routers/member.router.js';
import commentRouter from './routers/comment.router.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', memberRouter);
app.use('/projects', projectRouter);

app.use('/', commentRouter);
app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Start'));
