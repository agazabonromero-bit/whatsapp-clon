export async function sendCode(to, code) {
  try {
    const response = await fetch("https://whatsapp-cloner-backend.onrender.com/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error desconocido del servidor");
    }

    return data; 
  } catch (error) {
    console.error("❌ Error al conectar con el backend:", error);
    return { success: false, error: error.message };
  }
}