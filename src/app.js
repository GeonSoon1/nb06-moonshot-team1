import express from "express";
import cookieParser from "cookie-parser";
import { defaultNotFoundHandler, globalErrorHandler } from "./lib/errors/errorHandler.js";
import projectRouter from "./routers/project.router.js";



const app = express();


app.use(express.json());
app.use(cookieParser());


app.use("/projects", projectRouter);

app.use(defaultNotFoundHandler)
app.use(globalErrorHandler)

app.listen(3000, () => console.log("Server Start"));

