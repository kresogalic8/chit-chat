import React from 'react';

// styles
import styles from './ChatMessage.module.scss';

// context
import { SocketContext } from '@/context/socket';

// external libs
import classnames from 'classnames';
import dayjs from 'dayjs';

export default function ChatMessage({ message }) {
  // context
  const socket = React.useContext(SocketContext);

  const replaceStarWithStrong = (str) => {
    return str.replace(/\*/g, '<strong>').replace(/\*/g, '</strong>');
  };

  return (
    <div
      className={classnames(
        styles.chat__message,
        message.username === socket.id && styles.sender
      )}
    >
      <div className={styles.chat__message__inner}>
        <div
          dangerouslySetInnerHTML={{
            __html: replaceStarWithStrong(message.message),
          }}
        />
        <span>{dayjs(new Date(message?.createdAt)).format('h:mm A')}</span>
      </div>
    </div>
  );
}
