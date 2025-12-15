import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket"], // force websocket
  autoConnect: false, // connect manually
  withCredentials: true, // match backend CORS
});
