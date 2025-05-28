const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

module.exports = {
  app,
  server,
  io,
  getReceiverSocketId,
};