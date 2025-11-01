export const socket = io(
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://whatsapp-cloner-backend.onrender.com",
  {
    transports: ["websocket", "polling"],
    withCredentials: true,
  }
);