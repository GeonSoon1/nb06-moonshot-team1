<<<<<<< HEAD
import express from 'express';
import cookieParser from 'cookie-parser';
import { defaultNotFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';
import { PORT } from './lib/constants.js';
import projectRouter from './routers/project.router.js';
import memberRouter from './routers/member.router.js';
=======
import express from "express";
import cookieParser from "cookie-parser";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./lib/errors/errorHandler.js";
// import projectRouter from "./routers/project.router.js";
>>>>>>> 4db124a (서버 오류 해결)

const app = express();

app.use(express.json());
app.use(cookieParser());

<<<<<<< HEAD
app.use('/', memberRouter);
app.use('/projects', projectRouter);
=======
// app.use("/projects", projectRouter);
>>>>>>> 4db124a (서버 오류 해결)

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

<<<<<<< HEAD
app.listen(PORT, () => console.log('Server Start'));
=======
app.listen(3000, () => console.log("Server Start"));
>>>>>>> 4db124a (서버 오류 해결)
