export type HeartBeatResponse = {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  socketID: string;
  appName: string;
};
