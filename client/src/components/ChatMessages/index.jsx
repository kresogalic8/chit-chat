import React from 'react';

// styles
import styles from './ChatMessages.module.scss';

// context
import { SocketContext } from '@/context/socket';

// components
import { ChatMessage } from '@/components';

export default function ChatMessages() {
  // context
  const socket = React.useContext(SocketContext);

  // refs
  const messagesColumnRef = React.useRef(null);

  // state
  const [messages, setMessages] = React.useState([]);

  // Scroll to the most recent message
  React.useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messages]);

  // receive messages from server
  React.useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setMessages((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          createdAt: data.createdAt,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  return (
    <div className={styles.chat__messages} ref={messagesColumnRef}>
      {messages.map((message, index) => (
        <ChatMessage message={message} socket={socket} key={index} />
      ))}
    </div>
  );
}
