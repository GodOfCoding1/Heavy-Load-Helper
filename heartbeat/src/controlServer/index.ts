import { NextFunction, Request, Response } from "express";
import * as express from "express";
import * as http from "http";
import * as env from "dotenv";
import { appNameFinder, pendingRequests } from "../store/serverData";
import { WebSocketServer } from "../socket/WebSocketServer";
env.config();

export const controlServer = () => {
  const app = express();
  const httpServer = http.createServer(app);
  new WebSocketServer(httpServer);
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World! This is a monitor service");
  });

  app.get("/wait/:app_name/:url", async (req: Request, res: Response) => {
    pendingRequests[appNameFinder[req.params.app_name]].enqueue([
      req,
      res,
      req.params.url.replace("#-#", "/"),
    ]);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send("Something broke!");
    next();
  });

  return app;
};
