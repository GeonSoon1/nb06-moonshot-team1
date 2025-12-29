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
<<<<<<< HEAD
>>>>>>> 4db124a (서버 오류 해결)
=======
import commentRouter from "./routers/comment.router.js";
>>>>>>> bdedd44 (✨ feat : 테스트를 위한 인증 라이브러리 주석 처리)

const app = express();

app.use(express.json());
app.use(cookieParser());

<<<<<<< HEAD
app.use('/', memberRouter);
app.use('/projects', projectRouter);
=======
// app.use("/projects", projectRouter);
<<<<<<< HEAD
>>>>>>> 4db124a (서버 오류 해결)
=======
app.use("/", commentRouter);
>>>>>>> bdedd44 (✨ feat : 테스트를 위한 인증 라이브러리 주석 처리)

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

<<<<<<< HEAD
app.listen(PORT, () => console.log('Server Start'));
=======
app.listen(3000, () => console.log("Server Start"));
>>>>>>> 4db124a (서버 오류 해결)
