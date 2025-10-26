import React from 'react'
import "./PantallaLogueo.css"
import "./Tooltip.css"
import { FaInfoCircle } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from 'react-router-dom';
import Tooltip from '../components/Tooltip';
import logo from "../assets/logo-whatsapp.png"
import logotel from "../assets/logo-pc-tel-whatsapp.jpg"
import ajustes from "../assets/ajustes.png"
import logomenu from "../assets/menu-logo.PNG"

function PantallaLogueo() {
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
            <div className='caja-pasos'>
                <div className='inicio'>
                    <div className='pasos'>
                        <h1>Pasos para iniciar sesion</h1>
                        <ul>
                            <li> Abre Whatsapp <img src={logo} width={24} height={24} alt="" /> en tu telefono.</li>
                            <li> En Android, toca Menu <img src={logomenu} width={24} height={24} alt="" />
                                . En Iphone, toca Ajustes <img src={ajustes} width={24} height={24} alt="" />.</li>
                            <li> Toca Dispositivos vinculados y, luego, Vincular dispositivo.</li>
                            <li> Escanea el codigo QR para confirmar.</li>
                        </ul>
                        <label className="mantener-sesion">
                            <input type="checkbox" defaultChecked />
                            <span className="mantener">Mantener la sesión iniciada en este navegador</span>

                            <Tooltip text="Si seleccionas esta opción, se mantendrá la sesión iniciada
                             en WhatsApp Web después de cerrar la pestaña del navegador.">
                                <FaInfoCircle
                                    style={{
                                        marginLeft: "8px",
                                        cursor: "pointer",
                                        color: "#8696a0",
                                        fontSize: "18px",
                                    }}
                                />
                            </Tooltip>
                        </label>
                    </div>
                    <div className='qr-whatsapp'>
                        <QRCodeCanvas
                            value="https://web.whatsapp.com"
                            size={280}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"

                        />
                        <Link to="/phone" className='iniciar-sesion'>Iniciar sesion con numero de telefono
                            <span className="flecha">&gt;</span>
                        </Link>
                    </div>
                </div>

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

export default PantallaLogueo

