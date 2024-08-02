// src/pages/messaging/MessageList.js

import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import styles from "../../styles/MessageList.module.css";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function MessageList({ message, filter = "" }) {
  const [conversations, setConversations] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchConversations = async () => {
      console.log("fetchConversations called");

      if (!currentUser) {
        console.log("No current user, aborting fetch");
        return;
      }

      console.log("Fetching conversations for user:", currentUser);

      try {
        const { data } = await axiosReq.get(`/conversations/?${filter}search=${query}`);
        console.log("Fetched conversations data:", data); //pass
        setConversations(data);
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setHasLoaded(true); // Ensure we update loading state even on error
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchConversations();
    }, 1000);

    return () => {
      clearTimeout(timer);
      console.log("Timer cleared");
    };
  }, [filter, query, pathname, currentUser]);

  console.log("Conversations state:", conversations); //pass
  console.log("HasLoaded state:", hasLoaded); // false

  if (!conversations || !conversations.results) {
    return (
      <Container className={appStyles.Content}>
        <p>Unable to load conversations.</p>
      </Container>
    );
  }

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search conversations"
          />
        </Form>

        {hasLoaded ? (
          <>
            {Array.isArray(conversations.results) && conversations.results.length > 0 ? (
              <InfiniteScroll
                children={conversations.results.map((conversation) => (
                  <div key={conversation.id}>
                    <p>{conversation.username}</p>
                  </div>
                ))}
                dataLength={conversations.results.length}
                loader={<Asset spinner />}
                hasMore={!!conversations.next}
                next={() => fetchMoreData(conversations, setConversations)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
    </Row>
  );
}

export default MessageList;






// test notes: trying to call this array from GET https://odyssey-api-f3455553b29d.herokuapp.com/conversations/?Authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIyNDUwNjE1LCJqdGkiOiI2MTVjMTJkOTU3YmM0ZGRhOTg3NTU5NThlYzJlMjhkNyIsInVzZXJfaWQiOjEzfQ.p4oUHv2TsWiaF79NWkkOk-uzXxafRm9epqKW94dfdEk
// [{"id": 15,"username": "user3" }, {"id": 14,"username": "user2"},{"id": 16,"username": "user4"}]

// The above was retrieved successfully as a GET request with Postman API handler after POST login details https://odyssey-api-f3455553b29d.herokuapp.com/dj-rest-auth/login/
// with body: {"username": "user1","password": "password"}