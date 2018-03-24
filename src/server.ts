import * as express from "express";
import {Request, Response} from "express";
import config from "./config";
import {News} from "./Model/news";

export default async () => {
  const app = express();

  app.set("view engine", "pug");
  app.set("views", __dirname + "/Views");
  app.enable("view cache");

  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to CnBeta Spider");
  });

  app.get("/rss", async (req: Request, res: Response) => {
    try {
      const news = await News.find({}).sort({time: -1}).exec();
      res.render("rss", {news});
    } catch (err) {
      console.log(err);
      res.send("500");
    }
  });

  await app.listen(config.server.port, () => {console.log(`listen on ${config.server.port}`); });
};
