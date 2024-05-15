import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

export const Chat = () => {
    const [selectedRoom, setSelectedRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});

    useEffect(() => {
        socket.on('message', ({ room, message }) => {
            setMessages((prevMessages) => ({
                ...prevMessages,
                [room]: [...(prevMessages[room] || []), message],
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const joinRoom = () => {
        socket.emit('joinRoom', selectedRoom);
    };

    const sendMessage = () => {
        console.log('Sending message:', { roomName: selectedRoom, message });
        socket.emit('sendMessage', { roomName: selectedRoom, message });
        setMessage('');

        setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedRoom]: [...(prevMessages[selectedRoom] || []), message],
          }));
    };

    const handleChangeRoom = (room) => {
        setSelectedRoom(room);
    };

    return (
        <div>
            <div>
                <select value={selectedRoom} onChange={(e) => handleChangeRoom(e.target.value)}>
                    <option value="">Select a room</option>
                    <option value="general">General</option>
                    <option value="random">Random</option>
                    <option value="tech">Tech</option>
                </select>
                <button onClick={joinRoom}>Join Room</button>
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {selectedRoom && messages[selectedRoom] && messages[selectedRoom].map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
