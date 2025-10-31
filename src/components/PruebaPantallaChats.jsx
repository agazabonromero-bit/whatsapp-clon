import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import "./PruebaPantallaChats.css";
import chaticon from "../assets/chat-icon.png";
import estadosIcon from "../assets/estados-whatsapp.png";
import canalesIcon from "../assets/whatsapp-channels.png";
import comunidadesIcon from "../assets/comunidad-icon.png";
import ajustesIcon from "../assets/ajustes-icon.png";
import llamada from "../assets/videollamada-icon.png";
import lupa from "../assets/lupa-search.png"
import menu from "../assets/menu-3points.png"


function PantallaChats() {
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [chats, setChats] = useState([]);
    const [filter, setFilter] = useState("todos");
    const [search, setSearch] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [activeSection, setActiveSection] = useState("chats");
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io("https://whatsapp-cloner-backend.onrender.com", {
            transports: ["websocket"],
            withCredentials: true,
        });

        socket.current.on("connect", () => {
            console.log("Conectado al servidor Socket.io:", socket.current.id);
        });

        socket.current.on("receiveMessage", (data) => {
            console.log("Mensaje recibido:", data);
            if (selectedChat) {
                setSelectedChat((prev) => ({
                    ...prev,
                    mensajes: [...(prev?.mensajes || []), { texto: data.texto, tipo: "received" }],
                }));
            }
        });
        return () => {
            socket.current.disconnect();
        };
    }, [selectedChat]);




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


    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;

        const mensaje = { texto: newMessage };
        socket.current.emit("sendMessage", mensaje);

        setSelectedChat((prev) => ({
            ...prev,
            mensajes: [...(prev?.mensajes || []), { ...mensaje, tipo: "sent" }],
        }));

        setNewMessage("");
    };

    const renderMainContent = () => {
        switch (activeSection) {
            case "chats":
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
                                <button
                                    className={filter === "todos" ? "active" : ""}
                                    onClick={() => setFilter("todos")}
                                >
                                    Todos
                                </button>
                                <button
                                    className={filter === "no_leidos" ? "active" : ""}
                                    onClick={() => setFilter("no_leidos")}
                                >
                                    No leídos
                                </button>
                                <button
                                    className={filter === "favoritos" ? "active" : ""}
                                    onClick={() => setFilter("favoritos")}
                                >
                                    Favoritos
                                </button>
                                <button
                                    className={filter === "grupos" ? "active" : ""}
                                    onClick={() => setFilter("grupos")}
                                >
                                    Grupos
                                </button>
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
                                            title="Enviar mensaje">
                                            Enviar
                                        </button>
                                        <button
                                            onClick={() => handleReceiveMessage()}
                                            className="chat-receive-btn"
                                            title="Simular mensaje recibido">
                                            Recibir
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

            case "estados":
                return (
                    <div className="section-content">
                        <h2>Estados</h2>
                        <p>Aquí verás los estados de tus contactos.</p>
                    </div>
                );

            case "canales":
                return (
                    <div className="section-content">
                        <h2>Canales</h2>
                        <p>Descubre y sigue canales de información.</p>
                    </div>
                );

            case "comunidades":
                return (
                    <div className="section-content">
                        <h2>Comunidades</h2>
                        <p>Administra tus comunidades y grupos.</p>
                    </div>
                );

            case "ajustes":
                return (
                    <div className="section-content">
                        <h2>Ajustes</h2>
                        <p>Configura tu cuenta y preferencias.</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="whatsapp-layout">
            <div className="sidebar-menu">
                <div className="menu-top">
                    <button
                        className={`menu-item ${activeSection === "chats" ? "active" : ""}`}
                        onClick={() => setActiveSection("chats")}
                    >
                        <img src={chaticon} width={60} height={60} style={{ borderRadius: "30px" }} alt="chats" />
                        <span className="tooltip-text">Chats</span>
                    </button>

                    <button
                        className={`menu-item ${activeSection === "estados" ? "active" : ""}`}
                        onClick={() => setActiveSection("estados")}
                    >
                        <img src={estadosIcon} width={60} height={60} style={{ borderRadius: "30px" }} alt="estados" />
                        <span className="tooltip-text">Estados</span>
                    </button>

                    <button
                        className={`menu-item ${activeSection === "canales" ? "active" : ""}`}
                        onClick={() => setActiveSection("canales")}
                    >
                        <img src={canalesIcon} width={60} height={60} style={{ borderRadius: "30px" }} alt="canales" />
                        <span className="tooltip-text">Canales</span>
                    </button>

                    <button
                        className={`menu-item ${activeSection === "comunidades" ? "active" : ""}`}
                        onClick={() => setActiveSection("comunidades")}
                    >
                        <img src={comunidadesIcon} width={60} height={60} style={{ borderRadius: "30px" }} alt="comunidades" />
                        <span className="tooltip-text">Comunidades</span>
                    </button>
                </div>

                <div className="menu-bottom">
                    <button
                        className={`menu-item ${activeSection === "ajustes" ? "active" : ""}`}
                        onClick={() => setActiveSection("ajustes")}
                    >
                        <img src={ajustesIcon} width={60} height={60} style={{ borderRadius: "30px" }} alt="ajustes" />
                        <span className="tooltip-text">Ajustes</span>
                    </button>
                </div>
            </div>

            {renderMainContent()}
        </div>
    );
}

export default PantallaChats;