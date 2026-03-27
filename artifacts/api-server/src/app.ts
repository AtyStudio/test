import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

// Minimal shapes of what pino passes to the req/res serializers
type SerializedReq = { id?: unknown; method: string; url?: string };
type SerializedRes = { statusCode: number };

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: SerializedReq) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: SerializedRes) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export type { Request, Response };

export default app;
