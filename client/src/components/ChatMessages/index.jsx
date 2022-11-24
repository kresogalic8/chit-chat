import React from 'react';

// styles
import styles from './ChatMessages.module.scss';

// context
import { SocketContext } from '@/context/socket';

// components
import { ChatMessage } from '@/components';

export default function ChatMessages({ messages }) {
  // context
  const socket = React.useContext(SocketContext);

  // refs
  const messagesColumnRef = React.useRef(null);

  // Scroll to the most recent message
  React.useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className={styles.chat__messages} ref={messagesColumnRef}>
      {messages.map((message, index) => (
        <ChatMessage message={message} socket={socket} key={index} />
      ))}
    </div>
  );
}
