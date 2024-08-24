// src/pages/messaging/MessageList.js

import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Media from "react-bootstrap/Media";
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
  const [messages, setMessages] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosReq.get(`/messages/?${filter}search=${query}`);
        console.log(data); // Log fetched messages to verify structure
        setMessages({ results: Array.isArray(data) ? data : [] });
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchMessages();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <h2 className="text-center mb-4">Your Messages</h2>

        {hasLoaded ? (
          <>
            {messages.results.length > 0 ? (
              <InfiniteScroll
                dataLength={messages.results.length}
                loader={<Asset spinner />}
                hasMore={!!messages.next}
                next={() => fetchMoreData(messages, setMessages)}
              >
                {messages.results.map((message) => (
                  <div key={message.id} className={styles.MessageItem}>
                    <Link to={`/messages/${message.id}`}>
                      <Media className="align-items-center">
                        <Avatar src={message.recipient_profile_image} height={55} />
                        <div className="ml-3">
                          <p className={styles.MessageUsername}>{message.username}</p>
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
