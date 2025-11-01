import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://whatsapp-cloner-backend.onrender.com"; 

export const socket = io(URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});