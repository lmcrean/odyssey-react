// pages/messaging/MessageDetail.js

import React from 'react';
import { Link } from 'react-router-dom';

const MessageDetail = () => {
  return (
    <div>
      <h1>Message Detail</h1>
      <p><Link to="/messagelist">Back to Message List</Link></p>
    </div>
  );
};

export default MessageDetail;
