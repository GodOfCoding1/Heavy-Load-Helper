import { WebSocketClient } from "./WebSocketClient";

export const connectToSocket = (url: string) => {
  return new WebSocketClient(url);
};
