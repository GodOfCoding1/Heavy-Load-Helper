import { io, Socket } from "socket.io-client";
import { Events } from "../metadata/events";
import { client } from "../store/client";
import { getCpuUsage, getMemUsage } from "../helpers/hardwareUsage";
import { HeartBeatResponse } from "../metadata/interfaces";

export class WebSocketClient {
  constructor(url: string = "http://localhost:3000") {
    if (!process.env.APP_NAME) {
      throw new Error("APP_NAME not set in environment variables");
    }
    client.socket = io(url, {
      auth: {
        appName: process.env.APP_NAME,
      },
    });
    client.socket.on(Events.HEARTBEAT_PING, this.onHeartbeat);
  }
  onHeartbeat = () => {
    const response = {
      timestamp: Date.now(),
      cpuUsage: getCpuUsage(),
      memoryUsage: getMemUsage(),
      socketID: client.socket?.id,
      appName: process.env.APP_NAME,
    } as HeartBeatResponse;
    client.socket?.emit(Events.HEARTBEAT_ACK, response);
  };
}

export const heartbeat = (io: Socket, request: Request) => {
  const cpuUsage = getCpuUsage();
  const memoryUsage = getMemUsage();
  if (!process.env.MEM_THRESHOLD) {
    throw new Error("Memory threshold not set");
  }
  if (!process.env.CPU_THRESHOLD) {
    throw new Error("CPU threshold not set");
  }
  if (
    memoryUsage > parseFloat(process.env.MEM_THRESHOLD) ||
    cpuUsage > parseFloat(process.env.CPU_THRESHOLD)
  ) {
    const response = {
      timestamp: Date.now(),
      cpuUsage: cpuUsage,
      memoryUsage: memoryUsage,
      socketID: io?.id,
      request,
    };
    io?.emit(Events.BYBASS_REQ, response);
  }
};
