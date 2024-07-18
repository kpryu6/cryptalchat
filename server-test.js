const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3030;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
