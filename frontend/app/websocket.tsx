"use client";

import { useEffect, useRef, useState } from "react";

interface Chatmssg {
    username: string;
    message: string;
}

export default function Ws() {
    const socketRef = useRef<WebSocket | null>(null);
    const [mssg, setMssg] = useState<string>("");
    const [chats, setChats] = useState<Chatmssg[]>([]);
    const [openchat, setOpenchat] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");

    function chatenterhandler() {
        if (!username.trim()) {
            alert("Please enter a valid name");
            return;
        }
        setOpenchat(true);
    }

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:5000/ws");

        socketRef.current.onmessage = (event) => {
            try {
                const parsedMssg: Chatmssg = JSON.parse(event.data);
                setChats((prev) => [...prev, parsedMssg]);
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const sendMessage = () => {
        if (!mssg.trim()) return;

        if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
        ) {
            const payload = { username, message: mssg };
            socketRef.current.send(JSON.stringify(payload));
            setMssg("");
        } else {
            console.warn("WebSocket is not connected.");
        }
    };

    return (
        <>
            {openchat ? (
                <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
                    <div className="p-4 flex flex-col h-[80vh] w-[50vh] bg-gray-100 relative rounded-lg shadow-lg">
                        <div className="flex-1 overflow-y-auto mb-16 space-y-2">
                            {chats.map((e, index) => (
                                <div
                                    key={index}
                                    className="flex gap-1 items-start text-sm"
                                >
                                    <span className="font-bold text-gray-800">
                                        {e.username}:
                                    </span>
                                    <span className="text-gray-700 break-all">
                                        {e.message}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <input
                                className="h-10 border-black border-2 px-2 flex-1 rounded bg-white"
                                type="text"
                                value={mssg}
                                onChange={(e) => setMssg(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                                placeholder="Type something..."
                            />
                            <button
                                onClick={sendMessage}
                                className="border-2 border-black px-4 h-10 rounded bg-gray-100 hover:bg-gray-200 font-medium shrink-0"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-screen w-screen flex flex-col gap-3 items-center justify-center bg-gray-50">
                    <input
                        className="border-2 border-black px-3 py-2 rounded w-64"
                        type="text"
                        placeholder="Enter your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && chatenterhandler()
                        }
                    />
                    <button
                        onClick={chatenterhandler}
                        className="bg-black text-white px-4 py-2 rounded w-64 hover:bg-gray-800 transition"
                    >
                        Enter Chat
                    </button>
                </div>
            )}
        </>
    );
}
