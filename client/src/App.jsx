import './App.scss';

// components
import { Chat } from '@/components/';

// context
import { SocketProvider } from '@/context/socket';

function App() {
  return (
    <SocketProvider>
      <Chat />
    </SocketProvider>
  );
}

export default App;
