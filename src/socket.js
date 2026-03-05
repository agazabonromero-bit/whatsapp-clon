import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://whatsapp-cloner-backend.onrender.com";

export const socket = io(URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});


