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

// update message
const updateMessage = (io, data) => {
  const { room } = data;
  io.sockets.in(room).emit('update_message', data);
};

// typing indicator
const typing = (socket, data) => {
  const { room } = data;
  socket.to(room).emit('user_typing', data);
};

// stop typing indicator

// countdown
const startCountdown = (socket, data) => {
  console.log(data);
  const { room } = data;
  socket.to(room).emit('start_countdown', data);
};

// leave room

module.exports = {
  joinRoom,
  sendMessage,
  startCountdown,
  updateMessage,
  typing,
};
