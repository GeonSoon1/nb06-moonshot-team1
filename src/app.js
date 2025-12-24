import express from 'express';
import cookieParser from 'cookie-parser';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';
import memberRouter from './routers/member.router.js';
import { PORT } from './lib/constants.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', memberRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log('Server Start'));
