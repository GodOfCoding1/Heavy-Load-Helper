import { Events } from "../metadata/events";
import { Server } from "http";
import {
  appNameFinder,
  clientAddress,
  pendingRequests,
} from "../store/serverData";
import { HeartBeatResponse } from "../metadata/interfaces";

const socket = require("socket.io");
export class WebSocketServer {
  private io;
  private interval = 1000;
  private maxDelay = 2000;
  constructor(server: Server) {
    this.io = socket(server);
    this.io.on("connection", this.onConnection);
  }

  onConnection = (socket: any) => {
    if (!socket.handshake.auth.appName) {
      socket.join("monitor");
    }
    const appName = socket.handshake.auth.appName;
    clientAddress[socket.id] =
      socket.handshake.address.address + ":" + socket.handshake.address.port;
    if (!appNameFinder[socket.id]) appNameFinder[socket.id] = appName;

    this.sendHeartbeat(socket.id);
    socket.on(Events.HEARTBEAT_ACK, this.onHeartbeat);
    socket.on("disconnect", this.onDisconnect);
  };

  onDisconnect = (socketID: string) => {
    delete appNameFinder[socketID];
    delete clientAddress[socketID];
  };

  sendHeartbeat = (socketID: string) => {
    setInterval(() => {
      this.io.to(socketID).emit(Events.HEARTBEAT_PING);
    }, this.interval);
  };

  onHeartbeat = (payload: HeartBeatResponse) => {
    if (!process.env.MEM_THRESHOLD) {
      throw new Error("Memory threshold not set");
    }
    if (!process.env.CPU_THRESHOLD) {
      throw new Error("CPU threshold not set");
    }
    if (
      !pendingRequests[payload.appName].isEmpty() &&
      payload.memoryUsage < parseFloat(process.env.MEM_THRESHOLD) &&
      payload.cpuUsage < parseFloat(process.env.CPU_THRESHOLD)
    ) {
      const [req, res, urlpath] = pendingRequests[payload.appName].dequeue();
      const url = new URL(clientAddress[payload.socketID]);
      url.pathname = urlpath;
      res.redirect(307, url.toString());
    }
  };
}
