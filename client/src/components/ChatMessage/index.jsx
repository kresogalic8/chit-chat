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

  const replaceChars = (str) => {
    // replace string inside * with <strong> tag
    str = str?.replace(
      /\*(.*?)\*/g,
      '<span style="color: darkgrey;">$1</span>'
    );

    // replace string inside ~ with <del> tag
    str = str?.replace(/\~(.*?)\~/g, '<span style="font-size: 18px">$1</span>');

    // replace (smile) with smile emoji
    str = str?.replace(/\(smile\)/g, '😊');

    // replace (wink) with wink emoji
    str = str?.replace(/\(wink\)/g, '😉');

    return str;
  };

  return (
    <div
      className={classnames(
        styles.chat__message,
        message.username === socket.id && styles.sender,
        message?.fade && styles.fade
      )}
    >
      <div className={styles.chat__message__inner}>
        <div
          dangerouslySetInnerHTML={{
            __html: replaceChars(message.message),
          }}
        />
        <span>{dayjs(new Date(message?.createdAt)).format('h:mm A')}</span>
      </div>
    </div>
  );
}
