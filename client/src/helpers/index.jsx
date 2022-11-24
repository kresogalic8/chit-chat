const removeLastMessage = () => {
  console.log('removeLastMessage');
};

const startCountdown = ({ value, socket }) => {
  console.log('startCountdown', value, socket);

  const number = value.match(/\d+/g);
  const url = value.match(/(http|https):\/\/\S+/g);

  let count = number,
    intervalId;

  if (!intervalId) {
    intervalId = setInterval(() => {
      count = count - 1;
      if (count < 0) {
        clearInterval(intervalId);
        intervalId = null;
      } else {
        socket.volatile.emit('countdown', {
          room: 'general',
          count,
          url,
        });
      }
    }, 1000);
  }
};

const changeNickname = (value) => {
  console.log('changeNickname', value);
};

const fadelastMessage = () => {};

const highlightMessage = () => {};

export {
  removeLastMessage,
  startCountdown,
  changeNickname,
  fadelastMessage,
  highlightMessage,
};
