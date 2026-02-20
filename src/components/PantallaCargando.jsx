import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import "./PantallaCargando.css";
import whatsappgray from "../assets/whatsapp-gray.png"

function PantallaCargando() {
    const navigate = useNavigate();

    useEffect(() => {
        const usuario = localStorage.getItem("usuarioActual");

        // 🔒 Si no hay usuario, vuelve a selección
        if (!usuario) {
            navigate("/seleccion");
            return;
        }

        const t = setTimeout(() => {
            navigate("/chats");
        }, 2500);

        return () => clearTimeout(t);
    }, [navigate]);

    return (
        <div className="pantalla-carga">
            <div className="carga-contenido">
                <div className="logo-whatsapp">
                    <img src={whatsappgray} width={70} height={70} alt="gray" />
                </div>
                <p className="texto-carga">Cargando tus chats...</p>
                <div className="barra-progreso">
                    <div className="progreso"></div>
                </div>
                <p className="cifrado">
                    <span className="candado"></span> Cifrado de extremo a extremo
                </p>
            </div>
        </div>
    )
}

export default PantallaCargando

