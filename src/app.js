import express from 'express';
import cookieParser from 'cookie-parser';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';
import { PORT } from './lib/constants.js';
import projectRouter2 from './routers/project.router2.js';
import invitationRouter from './routers/invitation.router.js';
import commentRouter from './routers/comment.router.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/projects', projectRouter2);
app.use('/invitations', invitationRouter);
app.use('/', commentRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Start'));
