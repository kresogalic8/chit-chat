import React from 'react';

// styles
import styles from './Chat.module.scss';

// context
import { SocketContext } from '@/context/socket';

// libs
import classnames from 'classnames';
import { BsChatQuoteFill, BsChatQuote } from 'react-icons/bs';

// helpers
import { removeLastMessage, startCountdown } from '@/helpers';

// components
import { ChatMessages, ChatInput } from '@/components';

export default function Chat() {
  // context
  const socket = React.useContext(SocketContext);

  // state
  const [isChatActivated, setIsChatActivated] = React.useState(false);
  const [nickname, setNickname] = React.useState(null);

  // commands
  const commands = {
    nick: (value) => changeNickname(value),
    oops: () => removeLastMessage(),
    countdown: (value) => startCountdown(value),
    highlight: (value) => highlightMessage(value),
  };

  React.useEffect(() => {
    if (isChatActivated) {
      socket.emit('join_room', {
        username: `User ${socket.id}`,
        room: 'general',
      });

      setNickname(`User ${socket.id}`);
    }
  }, [isChatActivated, socket]);

  const executeCommand = (command, value) => {
    if (!commands[command]) alert('Command not found');

    if (commands[command]) {
      commands[command]({ value, socket });
    }
  };

  return (
    <div className={styles.chat}>
      <button
        type='button'
        className={classnames(
          styles.chat__bubble,
          isChatActivated && styles.chat__bubble_active
        )}
        onClick={() => setIsChatActivated(!isChatActivated)}
      >
        {isChatActivated ? (
          <BsChatQuoteFill size={20} color='white' />
        ) : (
          <BsChatQuote size={20} color='white' />
        )}
      </button>

      <div
        className={classnames(
          styles.chat__container,
          isChatActivated && styles.chat__container_active
        )}
      >
        <ChatMessages />
        <ChatInput onCallCommand={executeCommand} />
      </div>
    </div>
  );
}
