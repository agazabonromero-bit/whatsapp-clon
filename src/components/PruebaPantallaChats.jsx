import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import { supabase } from "../supabaseClient";
import "./PruebaPantallaChats.css";
import chaticon from "../assets/chat-icon.png";
import estadosIcon from "../assets/estados-whatsapp.png";
import canalesIcon from "../assets/whatsapp-channels.png";
import comunidadesIcon from "../assets/comunidad-icon.png";
import ajustesIcon from "../assets/ajustes-icon.png";
import llamada from "../assets/videollamada-icon.png";
import lupa from "../assets/lupa-search.png";
import menu from "../assets/menu-3points.png";

function PantallaChats() {
    const [chats, setChats] = useState([]);
    const [filter, setFilter] = useState("todos");
    const [search, setSearch] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [activeSection, setActiveSection] = useState("chats");
    const storedUser = localStorage.getItem("usuarioActual");
    const usuarioActual = storedUser ? JSON.parse(storedUser) : null;
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        if (!usuarioActual?.nombre) return;


        socket.on("connect", () => {
            console.log("🟢 CONECTADO A SOCKET:", socket.id);
            socket.emit("join", usuarioActual.nombre);
            console.log("👤 Join enviado:", usuarioActual.nombre);
        });


        socket.on("disconnect", () => {
            console.log("🔴 DESCONECTADO");
        });


        socket.on("receiveMessage", (mensaje) => {
            console.log("📩 Mensaje recibido:", mensaje);


            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.nombre === mensaje.from
                        ? {
                            ...chat,
                            mensajes: [
                                ...(chat.mensajes || []),
                                { ...mensaje, tipo: "received" },
                            ],
                        }
                        : chat
                )
            );


            if (selectedChat?.nombre === mensaje.from) {
                setSelectedChat((prev) => ({
                    ...prev,
                    mensajes: [
                        ...(prev?.mensajes || []),
                        { ...mensaje, tipo: "received" },
                    ],
                }));
            }
        });


        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("receiveMessage");
        };

    }, [usuarioActual?.nombre, selectedChat]);


    useEffect(() => {
        if (activeSection === "chats") {
            fetch("https://68e32f1e8e14f4523dacb062.mockapi.io/whatsapp/api/chats")
                .then((res) => res.json())
                .then((data) => {
                    const sanitized = data.map((chat) => ({
                        ...chat,
                        mensajes: chat.mensajes ? [...chat.mensajes] : [],
                    }));
                    setChats(sanitized);
                })
                .catch((err) => console.error("Error cargando chats:", err));
        }
    }, [activeSection]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;

        const mensaje = {
            texto: newMessage,
            from: usuarioActual.nombre,
            to: selectedChat.nombre,
            fecha: new Date().toISOString(),
        };

        socket.emit("sendMessage", mensaje);


        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.nombre === selectedChat.nombre
                    ? {
                        ...chat,
                        mensajes: [
                            ...(chat.mensajes || []),
                            { ...mensaje, tipo: "sent" },
                        ],
                    }
                    : chat
            )
        );


        setSelectedChat((prev) => ({
            ...prev,
            mensajes: [
                ...(prev?.mensajes || []),
                { ...mensaje, tipo: "sent" },
            ],
        }));

        setNewMessage("");
    };

    const filteredChats = chats.filter((chat) => {
        if (filter === "no_leidos" && Number(chat.unread || 0) <= 0) return false;
        if (filter === "favoritos" && !chat.favorito) return false;
        if (filter === "grupos" && !chat.esGrupo) return false;

        const searchLower = search.toLowerCase();
        return (
            chat.nombre.toLowerCase().includes(searchLower) ||
            chat.mensaje.toLowerCase().includes(searchLower)
        );
    });


    const renderMainContent = () => {
        if (activeSection !== "chats") {
            return (
                <div className="section-content">
                    <h2>{activeSection.toUpperCase()}</h2>
                    <p>Sección en desarrollo.</p>
                </div>
            );
        }

        return (
            <>
                <div className="sidebar-chats">
                    <p className="text-whatsapp">WhatsApp</p>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar un chat o iniciar uno nuevo"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="chat-filters">
                        {["todos", "no_leidos", "favoritos", "grupos"].map((key) => (
                            <button
                                key={key}
                                className={filter === key ? "active" : ""}
                                onClick={() => setFilter(key)}
                            >
                                {key.replace("_", " ")}
                            </button>
                        ))}
                    </div>

                    <div className="chat-list">
                        {filteredChats.length > 0 ? (
                            filteredChats.map((chat, index) => (
                                <div
                                    key={chat.id || index}
                                    className={`chat-item ${selectedChat?.id === chat.id ? "selected" : ""
                                        }`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <img
                                        src={chat.avatar}
                                        alt={chat.nombre}
                                        className="chat-avatar"
                                    />
                                    <div className="chat-info">
                                        <p className="chat-name">{chat.nombre}</p>
                                        <p className="chat-message">{chat.mensaje}</p>
                                    </div>
                                    <div className="chat-meta">
                                        <span className="chat-time">{chat.hora}</span>
                                        {chat.unread > 0 && (
                                            <span className="chat-unread">{chat.unread}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-chats">No hay chats que coincidan.</p>
                        )}
                    </div>
                </div>

                <div className="chat-window">
                    {selectedChat ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <img
                                        src={selectedChat.avatar}
                                        alt={selectedChat.nombre}
                                        className="chat-header-avatar"
                                    />
                                    <p className="chat-title">{selectedChat.nombre}</p>
                                </div>
                                <div className="chat-header-actions">
                                    <button>
                                        <img className="chat-icon" src={llamada} alt="video-llamada" />
                                    </button>
                                    <button>
                                        <img className="chat-icon" src={lupa} alt="lupa-search" />
                                    </button>
                                    <button>
                                        <img className="chat-icon" src={menu} alt="menu-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {(selectedChat.mensajes || []).map((msg, index) => (
                                    <div
                                        key={`${selectedChat.id}-${index}`}
                                        className={`message ${msg.tipo === "sent" ? "sent" : "received"
                                            }`}
                                    >
                                        {msg.texto}
                                    </div>
                                ))}
                            </div>

                            <div className="chat-input">
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    className="chat-input-field"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="chat-send-btn"
                                    title="Enviar mensaje"
                                >
                                    Enviar
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="empty-chat">
                            <p>Selecciona un chat para ver los mensajes</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="whatsapp-layout">
            <div className="sidebar-menu">
                <div className="menu-top">
                    {["chats", "estados", "canales", "comunidades"].map((sec) => (
                        <button
                            key={sec}
                            className={`menu-item ${activeSection === sec ? "active" : ""}`}
                            onClick={() => setActiveSection(sec)}
                        >
                            <img
                                src={
                                    sec === "chats"
                                        ? chaticon
                                        : sec === "estados"
                                            ? estadosIcon
                                            : sec === "canales"
                                                ? canalesIcon
                                                : comunidadesIcon
                                }
                                width={60}
                                height={60}
                                style={{ borderRadius: "30px" }}
                                alt={sec}
                            />
                            <span className="tooltip-text">{sec}</span>
                        </button>
                    ))}
                </div>

                <div className="menu-bottom">
                    <button
                        className={`menu-item ${activeSection === "ajustes" ? "active" : ""
                            }`}
                        onClick={() => setActiveSection("ajustes")}
                    >
                        <img
                            src={ajustesIcon}
                            width={60}
                            height={60}
                            style={{ borderRadius: "30px" }}
                            alt="ajustes"
                        />
                        <span className="tooltip-text">Ajustes</span>
                    </button>
                </div>
            </div>

            {renderMainContent()}
        </div>
    );
}

export default PantallaChats;   