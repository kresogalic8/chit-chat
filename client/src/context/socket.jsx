import React from 'react';
import io from 'socket.io-client';

// config
import { SERVER_URL } from '@/config';

// create context for socket
const SocketContext = React.createContext();

// create provider for socket
const SocketProvider = ({ children }) => {
  // create socket
  const socket = io.connect(SERVER_URL);

  // return provider
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// export socket context and provider
export { SocketContext, SocketProvider };
