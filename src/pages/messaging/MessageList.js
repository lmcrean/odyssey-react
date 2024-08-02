// pages/messaging/MessageList.js


import React, { useEffect, useState, useContext } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser || !currentUser.token) {
        console.error('Token is missing or current user is not set'); // Not registering
        return;
      }

      console.log('Current user (MessageList):', currentUser); // FAIL. Not registering
      console.log('Current user token (MessageList):', currentUser.token); // FAIL. Not registering

      try {
        const response = await axiosReq.get('/conversations/', {
          headers: {
            Authorization: `Token ${currentUser.token}`,
            'Content-Type': 'application/json', // Specify Content-Type for this request
          },
        });
        console.log('Fetched conversations:', response.data); // FAIL. Not registering
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error); // FAIL. Not registering
      }
    };

    if (currentUser && currentUser.token) {
      console.log('Fetching conversations...'); // FAIL. Not registering
      fetchConversations();
    } else {
      console.log('Current user or token is missing:', currentUser); // Current user or token is missing: undefined
    }
  }, [currentUser]);

  console.log('Conversations state:', conversations); // Conversations state: []

  return (
    <div>
      <h1>Conversations</h1>
      <ul>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <li key={conversation.id}>{conversation.username}</li>
          ))
        ) : (
          <p>No conversations found.</p>
        )}
      </ul>
    </div>
  );
};

export default MessageList;

// test notes: trying to call this array from GET https://odyssey-api-f3455553b29d.herokuapp.com/conversations/?Authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIyNDUwNjE1LCJqdGkiOiI2MTVjMTJkOTU3YmM0ZGRhOTg3NTU5NThlYzJlMjhkNyIsInVzZXJfaWQiOjEzfQ.p4oUHv2TsWiaF79NWkkOk-uzXxafRm9epqKW94dfdEk
// [{"id": 15,"username": "user3" }, {"id": 14,"username": "user2"},{"id": 16,"username": "user4"}]

// The above was retrieved successfully as a GET request with Postman API handler after POST login details https://odyssey-api-f3455553b29d.herokuapp.com/dj-rest-auth/login/
// with body: {"username": "user1","password": "password"}