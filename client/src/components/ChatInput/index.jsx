import React from 'react';

// styles
import styles from './ChatInput.module.scss';

// context
import { SocketContext } from '@/context/socket';

// external libs
import { BiSend } from 'react-icons/bi';
import useEffectOnce from '@/hooks/useEffectOnce';

export default function ChatInput({ onCallCommand }) {
  // context
  const socket = React.useContext(SocketContext);

  // state
  const [message, setMessage] = React.useState('');
  const [count, setCount] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(false);

  // refs
  const inputRef = React.useRef();

  // listen for countdown command
  useEffectOnce(
    () => {
      socket.on('start_countdown', (data) => {
        const { count, url } = data;
        setCount(count);

        count === 0 && window.open(url, '_blank');
      });
    },
    [socket],
    (dependencies) => dependencies
  );

  React.useEffect(() => {
    socket.on('user_typing', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => socket.off('user_typing');
  }, []);

  const handleSendMessage = () => {
    if (message === '') alert('Please enter a message');

    if (message.length > 0) {
      const createdAt = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', {
        username: socket.id,
        room: 'general',
        message,
        createdAt,
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (message.startsWith('/')) {
        const [command, ...value] = message.split(' ');
        onCallCommand(command.replace('/', ''), value.join(' '));
        setMessage('');
      } else {
        handleSendMessage();
      }
    }
  };

  const handleChange = (e) => setMessage(e.target.value);

  const handleTyping = (e) => {
    if (e.target.value === '') return;

    // emit typing
    socket.emit('typing', {
      username: socket.id,
      room: 'general',
      isTyping: true,
    });

    // add timeout to prevent spamming
    let typingTimeout;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('typing', {
        username: socket.id,
        room: 'general',
        isTyping: false,
      });
    }, 1000);
  };

  return (
    <div className={styles.chat__input}>
      {isTyping && <p>The user is typing...</p>}

      {count !== 0 && (
        <div className={styles.chat__countdown}>
          <span>You will be redirected in {count} seconds</span>
        </div>
      )}

      <input
        ref={inputRef}
        type='text'
        placeholder='Type a message'
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onKeyDown={handleTyping}
      />

      <button type='button' onClick={handleSendMessage}>
        <BiSend size={20} color='purple' />
      </button>
    </div>
  );
}
