import React from "react";
import { useNavigate } from "react-router-dom";
import "./SeleccionUsuario.css";

function SeleccionUsuario() {

    const navigate = useNavigate();

    const usuarios = [
        {
            nombre: "Laura Gómez",
            id: "123",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
            nombre: "Carlos Pérez",
            id: "456",
            avatar: "https://randomuser.me/api/portraits/men/42.jpg",
        },
    ];

    const seleccionarUsuario = (usuario) => {
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));        
        navigate("/loading");
    };

    return (
        <div className="select-user-container">
            <div className="select-user-card">
                <h2>Selecciona un Usuario</h2>

                <div className="user-list">
                    {usuarios.map((u) => (
                        <button
                            key={u.id}
                            className="user-item"
                            onClick={() => seleccionarUsuario(u)}
                        >
                            <img src={u.avatar} alt={u.nombre} />
                            <span>{u.nombre}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SeleccionUsuario;