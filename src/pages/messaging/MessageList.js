// src/pages/messaging/MessageList.js

import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Media from "react-bootstrap/Media";  // Import Media from react-bootstrap
import { useLocation, Link } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import styles from "../../styles/MessageList.module.css";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";

function MessageList({ message, filter = "" }) {
  const [conversations, setConversations] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log("Fetching conversations...");
        const { data } = await axiosReq.get(`/conversations/?${filter}search=${query}`);
        console.log("Fetched conversations data:", data);

        // Ensure results is always an array
        setConversations({ results: Array.isArray(data) ? data : [] });
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchConversations();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  console.log("Conversations state before check:", conversations);
  console.log("HasLoaded state before check:", hasLoaded);
  console.log("Type of conversations:", typeof conversations);

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
            {conversations.results.length > 0 ? (
              <InfiniteScroll
                dataLength={conversations.results.length}
                loader={<Asset spinner />}
                hasMore={!!conversations.next}
                next={() => fetchMoreData(conversations, setConversations)}
              >
                {conversations.results.map((conversation) => (
                  <div key={conversation.id} className={styles.ConversationItem}>
                    <Link to={`/conversations/${conversation.id}`}>
                      <Media className="align-items-center">
                        <Avatar src={conversation.profile_image} height={55} />
                        <div className="ml-3">
                          <p className={styles.ConversationUsername}>{conversation.username}</p>
                        </div>
                      </Media>
                    </Link>
                  </div>
                ))}
              </InfiniteScroll>
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
