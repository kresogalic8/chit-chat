import React from 'react';

// styles
import styles from './ChatInput.module.scss';

// context
import { SocketContext } from '@/context/socket';

// external libs
import { BiSend } from 'react-icons/bi';

export default function ChatInput({ onSendMessage, onCallCommand }) {
  // context
  const socket = React.useContext(SocketContext);

  // state
  const [message, setMessage] = React.useState('');

  // refs
  const inputRef = React.useRef();

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

  return (
    <div className={styles.chat__input}>
      <input
        ref={inputRef}
        type='text'
        placeholder='Type a message'
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />

      <button type='button' onClick={handleSendMessage}>
        <BiSend size={20} color='purple' />
      </button>
    </div>
  );
}