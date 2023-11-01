import { NextFunction, Request, Response } from "express";
import { getCpuUsage, getMemUsage } from "../helpers/hardwareUsage";

export function requestForward(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cpuUsage = getCpuUsage();
  const memoryUsage = getMemUsage();
  if (!process.env.MEM_THRESHOLD) {
    throw new Error("Memory threshold not set");
  }
  if (!process.env.CPU_THRESHOLD) {
    throw new Error("CPU threshold not set");
  }
  console.log("Memory:", memoryUsage);
  console.log("CPU:", cpuUsage);
  if (
    memoryUsage > parseFloat(process.env.MEM_THRESHOLD) ||
    cpuUsage > parseFloat(process.env.CPU_THRESHOLD)
  ) {
    console.log("Low on resoures..rerouting to monitor");
    if (!process.env.MONITOR_URL) {
      throw new Error("MONITOR_URL url not set");
    }
    const url = new URL(process.env.MONITOR_URL);
    url.pathname =
      "wait/" +
      process.env.APP_NAME +
      "/" +
      req.originalUrl.replace("/", "#-#") +
      "";
    res.redirect(307, url.toString());
  } else {
    console.log("No shortage of resourse");
    next();
  }
}
