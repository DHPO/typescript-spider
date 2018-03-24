import * as express from "express";
import {Request, Response} from "express";
import config from "./config";

export default async () => {
  const app = express();
  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to CnBeta Spider");
  });
  await app.listen(config.server.port, () => {console.log(`listen on ${config.server.port}`); });
};
