import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import { env } from "./utils/env.js";
import studentsRouter from "./routers/students.js";
dotenv.config();

const PORT = Number(env("PORT", 3000));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  // app.use((req, res, next) => {
  //   console.log(req.body);
  //   next();
  // });

  function middlewareA(req, res, next) {
    console.log("Hi!");
    next();
  }

  // app.get("/", middlewareA, (req, res) => {
  //   res.json({
  //     message: "Hello world!",
  //   });
  // });

  app.post("/", (req, res) => {
    console.log(req.body);
    res.json(req.body);
  });

  app.use(studentsRouter);

  app.use("*", (req, res, next) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
