import { io } from "socket.io-client";

console.log("🌐 SOCKET URL:", import.meta.env.VITE_SOCKET_URL);

const URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://whatsapp-cloner-backend.onrender.com";

export const socket = io(URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});


