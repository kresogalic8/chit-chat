const CHAT_BOT = 'ChatBot';

// join room
const joinRoom = (socket, data) => {
  const { username, room } = data;
  socket.join(room); // Join the user to a socket room

  let createdAt = Date.now();
  // Send message to all users currently in the room, apart from the user that just joined
  socket.to(room).emit('receive_message', {
    message: `${username} has joined the chat room`,
    username: CHAT_BOT,
    createdAt,
  });

  // Send welcome msg to user that just joined chat only
  socket.emit('receive_message', {
    message: `Welcome ${username}`,
    username: CHAT_BOT,
    createdAt,
  });
};

// send message
const sendMessage = (io, data) => {
  const { room } = data;
  io.sockets.in(room).emit('receive_message', data);
};

// typing indicator

// stop typing indicator

// countdown

// leave room

module.exports = {
  joinRoom,
  sendMessage,
};
