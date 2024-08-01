// pages/messaging/MessageList.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/MessageList.module.css';

const MessageList = () => {
  return (
    <div className={styles.MessageList}>
      <h1>Message List</h1>
      <p>Here is a list of your conversations:</p>
      <ul>
        {/* This is a placeholder. You will replace this with actual data fetching and rendering */}
        <li><Link to="/messagedetail">Conversation with User 1</Link></li>
        <li><Link to="/messagedetail">Conversation with User 2</Link></li>
      </ul>
    </div>
  );
};

export default MessageList;
