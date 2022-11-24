import React from 'react';

// styles
import styles from './Chat.module.scss';

// context
import { SocketContext } from '@/context/socket';

// libs
import classnames from 'classnames';
import { BsChatQuoteFill, BsChatQuote } from 'react-icons/bs';

// helpers
import { startCountdown } from '@/helpers';

// components
import { ChatMessages, ChatInput } from '@/components';

export default function Chat() {
  // context
  const socket = React.useContext(SocketContext);

  // state
  const [isChatActivated, setIsChatActivated] = React.useState(false);
  const [nickname, setNickname] = React.useState(null);
  const [messages, setMessages] = React.useState([]);

  // commands
  const commands = {
    nick: (value) => changeNickname(value),
    oops: (value) => removeLastMessage(value),
    countdown: (value) => startCountdown(value),
    highlight: (value) => highlightMessage(value),
    think: (value) => changeTextColor(value),
    fadelast: (value) => fadeLastMessage(value),
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

  // receive messages from server
  React.useEffect(() => {
    socket.on('receive_message', (data) => {
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

  React.useEffect(() => {
    socket.on('update_message', (data) => {
      console.log(data);
      // find message in state and update with new_message
      setMessages((state) => {
        const index = state.findIndex(
          (message) => message.message === data.message
        );
        console.log(index);
        const newState = [...state];
        if (index !== -1) {
          newState[index].message = data.new_message;
          newState[index].fade = data?.fade || false;

          return newState;
        }
        return state;
      });
    });

    // Remove event listener on component unmount
    return () => socket.off('update_message');
  }, []);

  const executeCommand = async (command, value) => {
    if (!commands[command]) alert('Command not found');

    if (commands[command]) {
      commands[command]({ value, socket });
    }
  };

  const removeLastMessage = () => {
    setMessages((state) => {
      const index = state.findIndex(
        (message) => message.username === socket.id
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
      return [...state];
    });
  };

  const fadeLastMessage = () => {
    // find last message from username
    const lastMessage = messages
      .filter((message) => message.username === socket.id)
      .pop();

    socket.emit('update_message', {
      username: lastMessage.username,
      room: 'general',
      message: lastMessage.message,
      new_message: lastMessage.message,
      fade: true,
    });
  };

  const changeTextColor = ({ value }) => {
    const message = messages.find((message) => message.message === value);
    const newMessage = `*${message.message}*`;

    socket.emit('update_message', {
      username: message.username,
      room: 'general',
      message: message.message,
      new_message: newMessage,
    });
  };

  const highlightMessage = ({ value }) => {
    const message = messages.find((message) => message.message === value);
    const newMessage = `~${message.message}~`;

    socket.emit('update_message', {
      username: message.username,
      room: 'general',
      message: message.message,
      new_message: newMessage,
    });
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
        <ChatMessages messages={messages} />
        <ChatInput onCallCommand={executeCommand} />
      </div>
    </div>
  );
}
