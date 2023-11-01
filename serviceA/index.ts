import { NextFunction, Request, Response } from "express";
import * as express from "express";
import * as env from "dotenv";
import { requestForward, connectToSocket } from "@godofcoding/heartbeat/src";

env.config();

const app = express();
app.use("*", requestForward);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is service A");
});

app.get("/heavy", async (req: Request, res: Response) => {
  console.log("starting heavy task");
  console.time("heavy");
  const baseNumber = 100000;
  let result = 0;
  for (var i = Math.pow(baseNumber, 7); i >= 0; i--) {
    result += Math.atan(i) * Math.tan(i);
  }
  console.timeEnd("heavy");
  console.log("finished heavy task");
  res.send("finished heavy task");
});

connectToSocket(process.env.MONITOR_URL!);
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
