import { io, type Socket } from "socket.io-client";
import { createContext, useContext, useEffect } from "react";

export const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket"], // force websocket
  autoConnect: false, // connect manually
  withCredentials: true,
});

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Do not disconnect on unmount; keep socket alive across pages/tabs
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used inside SocketProvider");
  return context;
};
