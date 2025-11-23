import React from "react";
import { useNavigate } from "react-router-dom";

function SeleccionUsuario() {
    const usuarios = [
        { nombre: "Laura Gómez", id: "123", avatar: "https://randomuser.me/api/portraits/women/65.jpg"},
        { nombre: "Carlos Pérez", id: "456", avatar: "https://randomuser.me/api/portraits/men/42.jpg"},
    ];

    const seleccionarUsuario = (nombre) => {
        const usuario = usuarios.find((u) => u.nombre === nombre);

        if (usuario) {
            localStorage.setItem("usuarioActual", JSON.stringify(usuario));
            window.location.reload(); 
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <h2>Selecciona un usuario</h2>
            {usuarios.map((u) => (
                <button
                    key={u.id}
                    onClick={() => seleccionarUsuario(u.nombre)}
                    style={{
                        display: "block",
                        margin: "10px 0",
                        padding: "10px",
                        fontSize: "16px",
                    }}
                >
                    Entrar como {u.nombre}
                </button>
            ))}
        </div>
    );
}
export default SeleccionUsuario;