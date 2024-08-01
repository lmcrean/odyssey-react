// pages/messaging/MessageList.js
import React, { useEffect, useState, useContext } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser?.token) {
        console.error('Token is missing'); // doesn't appear
        return;
      }

      try {
        const response = await axiosReq.get('/conversations/', {
          headers: {
            Authorization: `Token ${currentUser.token}`,
          },
        });
        console.log('Fetched conversations:', response.data); // doesn't appear
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error); // doesn't appear
      }
    };

    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  console.log('Conversations state:', conversations); // "conversation state, array 0"

  return (
    <div>
      <h1>Conversations</h1>
      <ul>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <li key={conversation.id}>{conversation.username}</li> // when this feature is fully, working, for user1, it should return an array of 3 users.
          ))
        ) : (
          <p>No conversations found.</p> // this currently appears
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