import { useEffect } from "react";
import io from "socket.io-client";

const getServerURL = () => {
  const ip = localStorage.getItem("server_ip") || "localhost";
  const port = localStorage.getItem("server_port") || "5000";
  return `http://${ip}:${port}`;
};

const WebSocketClient = ({ onDataReceived, onConnectionChange }) => {
  useEffect(() => {
    const socket = io(getServerURL());

    let lastDataTime = Date.now();

    // If no data for 3 seconds → inactive
    let isActive = true;

    const watchdog = setInterval(() => {
      if (!isActive) return;

      if (Date.now() - lastDataTime > 3000) {
        localStorage.setItem("auv_connected", "false");
        onConnectionChange?.(false);
      }
    }, 1000);


    socket.on("connect", () => {
      console.log("🟢 Socket connected");
    });

    socket.on("auv_update", (data) => {
      lastDataTime = Date.now();

      localStorage.setItem("auv_connected", "true");
      onConnectionChange?.(true);

      onDataReceived(data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      localStorage.setItem("auv_connected", "false");
      onConnectionChange?.(false);
    });

    return () => {
      isActive=false;
      clearInterval(watchdog);
      socket.disconnect();
    };
  }, [onDataReceived, onConnectionChange]);

  return null;
};

export default WebSocketClient;
