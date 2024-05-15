const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

const rooms = new Map();

io.on('connection', (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on('joinRoom', (roomName) => {
        if (!rooms.has(roomName)) {
            rooms.set(roomName, []);
        }
        socket.join(roomName);
        socket.emit('roomMessages', rooms.get(roomName));
        console.log(`Client joined room ${roomName}`);
    });

    socket.on('sendMessage', ({ roomName, message }) => {
        console.log(`Client sent message ${message} to room ${roomName}`);
        const roomMessages = rooms.get(roomName) || [];
        roomMessages.push(message);
        rooms.set(roomName, roomMessages);
        io.to(roomName).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
