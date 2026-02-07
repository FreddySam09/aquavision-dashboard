//components/WebSocketClient.jsx
import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const WebSocketClient = ({ onDataReceived }) => {
  useEffect(() => {
    socket.on("auv_update", (data) => {
      onDataReceived(data);
    });

    return () => {
      socket.off("auv_update");
    };
  }, [onDataReceived]);

  return null;
};

export default WebSocketClient;
