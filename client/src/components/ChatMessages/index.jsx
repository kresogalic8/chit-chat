import React from 'react';

// context
import { SocketContext } from '@/context/socket';

export default function ChatMessages() {
  // context
  const socket = React.useContext(SocketContext);

  // state
  const [messages, setMessages] = React.useState([]);

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

  return <div>{messages.length}</div>;
}
