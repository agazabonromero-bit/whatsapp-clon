import { Link } from 'react-router-dom';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import "./PantallaLogTel.css"
import "./PantallaLogueo.css"
import logo from "../assets/logo-whatsapp.png"
import logotel from "../assets/logo-pc-tel-whatsapp.jpg"



function PantallaLogTel() {

    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("");
    const countries = useMemo(() => countryList().getData(), []);
    const countryName = countries.find((c) => c.value.toLowerCase() === country)?.label;
    const navigate = useNavigate();
    const generarCodigo = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let codigo = "";
        for (let i = 0; i < 8; i++) {
            codigo += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return codigo;
    };
    const handleContinuar = async (e) => {
        e.preventDefault();

        let cleanPhone = phone.replace(/\D/g, ""); 
        if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1); 
        const telefonoCompleto = "+" + phone; 

        if (!phone || phone.length < 10) {
            alert("⚠️ Por favor ingresa un número de teléfono válido.");
            return;
        }

        const codigo = generarCodigo();

        // Guardar en localStorage
        localStorage.setItem("telefono", telefonoCompleto);
        localStorage.setItem("codigoTemporal", codigo);

        try {
            console.log("📱 Enviando a backend:", telefonoCompleto, "Código:", codigo);

            const response = await fetch("http://localhost:5000/api/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: telefonoCompleto, code: codigo }), 
            });

            const data = await response.json();

            if (data.success) {
                console.log("✅ SMS enviado correctamente");
                navigate("/code", { state: { telefono: telefonoCompleto } });
            } else {
                alert("❌ No se pudo enviar el SMS: " + (data.error || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error al enviar el SMS:", error);
            alert("Error al enviar el SMS. Revisa tu backend o la conexión con Twilio.");
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
            <div className="login-telefono">
                <p className='Ing-p'>Ingresa el numero de telefono</p>
                <p className="subtexto">Selecciona un pais e ingresa tu numero de telefono.</p>

                <form className="form-telefono" onSubmit={(e) => {
                    e.preventDefault();
                    handleContinuar();
                }}>
                    <PhoneInput
                        country={"co"}
                        value={phone}
                        onChange={setPhone}
                        inputClass="input-numero"
                        containerClass="contenedor-telefono"
                        buttonClass="bandera-btn"
                        dropdownClass='lista-paises'
                        enableSearch={true}
                        onChangeCountry={(c) => setCountry(c)}
                    />
                    <button onClick={handleContinuar} type="submit" className="btn-siguiente">
                        Siguiente
                    </button>

                </form>

                <Link to="/"><span className="link-qr">
                    Iniciar sesion con codigo QR <span className="flecha">&gt;</span>
                </span>
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
    )
}

export default PantallaLogTel

