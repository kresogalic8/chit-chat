const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const sockets = require('./sockets.js');

// cors middleware
app.use(cors());

// server instance
const server = http.createServer(app);

// Create an io server and allow for CORS from http://127.0.0.1:5173 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST'],
  },
});

// io server listens for a connection
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  // join room
  socket.on('join_room', (data) => sockets.joinRoom(socket, data));

  // send message
  socket.on('send_message', (data) => sockets.sendMessage(io, data));

  // disconnect user from socket
  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

// listen on port 9999
server.listen(9999, () => {
  console.log('listening on *:9999');
});
