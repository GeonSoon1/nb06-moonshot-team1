import express from "express";
import cookieParser from "cookie-parser";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./lib/errors/errorHandler.js";
import memberRouter from "./routers/member.router.js";
import { InvitationStatus } from "@prisma/client";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/projects", memberRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(3000, () => console.log("Server Start"));
