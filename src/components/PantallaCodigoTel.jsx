import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-whatsapp.png"
import logotel from "../assets/logo-pc-tel-whatsapp.jpg"
import ajustes from "../assets/ajustes.png"
import logomenu from "../assets/menu-logo.png"
import "./PantallaCodigoTel.css";

function PantallaCodigoTel() {
  const location = useLocation();
  const navigate = useNavigate();
  const telefono = location.state?.telefono || localStorage.getItem("telefono");

  const [inputs, setInputs] = useState(Array(8).fill(""));
  const [codigoGuardado, setCodigoGuardado] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar el código que Twilio envió
  useEffect(() => {
    const codigo = localStorage.getItem("codigoTemporal");
    if (codigo) setCodigoGuardado(codigo);
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const nuevos = [...inputs];
    nuevos[index] = value.toUpperCase();
    setInputs(nuevos);

    // Mover foco al siguiente input
    if (value && index < 7) {
      document.getElementById(`input-${index + 1}`).focus();
    }

    // Si ya llenó los 8, verificar automáticamente
    const completo = nuevos.join("");
    if (completo.length === 8) {
      handleVerificar(completo);
    }
  };

  
  const handleVerificar = (codigoIngresado) => {
    if (codigoIngresado === codigoGuardado) {
      setLoading(true);
      setTimeout(() => navigate("/loading"), 1000);
    } else {
      alert("❌ Código incorrecto. Inténtalo de nuevo.");
      setInputs(Array(8).fill(""));
      document.getElementById("input-0").focus();
    }
  };

    return (
        <div>
            <div className='header'>
                <img src={logo} alt="whatsapp" className='logo-whatsapp' />
                <p className='text-whatsapp'>Whatsapp</p>
            </div>
            <div className="caja-descarga">
                <img src={logotel} alt="WhatsApp logo" className="caja-logo" />
                <div className='caja-textos'>
                    <p className="caja-texto">Descarga WhatsApp para Windows</p>
                    <p className='parrafo'>Descarga la aplicacion para Windows y haz llamadas, comparte
                        pantalla y disfruta de una experiencia mas rapida.</p>
                </div>
                <a href="https://web.whatsapp.com/desktop/windows/release/WhatsAppSetup.exe" download>
                    <button className="caja-boton">Descargar
                        <span className='arrow-down'>&darr;</span></button>
                </a>

            </div>
            <div className="codigo-container">
                <h2 className="codigo-titulo">Ingresa el código en el teléfono</h2>
                <p className="codigo-subtitulo">
                    Vinculando la cuenta de WhatsApp:
                    <span className="codigo-numero">{telefono}</span>
                    <Link to="/phone" className="editar-number">(editar)</Link>
                </p>

                <div className="codigo-inputs">
                    {inputs.map((valor, i) => (
                        <input
                            key={i}
                            id={`input-${i}`}
                            type="text"
                            maxLength="1"
                            value={valor}
                            onChange={(e) => handleChange(i, e.target.value)}
                            className="codigo-input"
                        />
                    ))}
                </div>

                <div className="codigo-pasos">
                    <ul>
                        <li> Abre Whatsapp <img src={logo} width={24} height={24} alt="" /> en tu telefono.</li>
                        <li> En Android, toca Menu <img src={logomenu} width={24} height={24} alt="" />
                            . En Iphone, toca Ajustes <img src={ajustes} width={24} height={24} alt="" />.</li>
                        <li> Toca Dispositivos vinculados y, luego, Vincular dispositivo.</li>
                        <li> Toca Vincular con el numero de telefono e ingresa este codigo en tu telefono.</li>
                    </ul>
                </div>

                <Link to="/">
                    <p className="codigo-link">Iniciar sesión con código QR <span className="flecha">&gt;</span></p>
                </Link>
            </div>
            <div className='footer'>
                <p className=''>No tienes una cuenta de Whatsapp?{"   "}
                    <a href="https://faq.whatsapp.com/497209988909970/?cms_platform=android"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-verde">Primeros pasos</a>
                    <span className="flecha">&gt;</span></p>
                <p className='mensaje'> Tus mensajes personales estan cifrados de extremo a extremo</p>
                <a href='https://www.whatsapp.com/legal/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='condiciones'>Condiciones y Politica de privacidad</a>
            </div>
        </div>

    );
};

export default PantallaCodigoTel;