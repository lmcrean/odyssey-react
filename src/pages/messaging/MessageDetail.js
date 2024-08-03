// src/pages/messaging/MessageDetail.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import appStyles from "../../App.module.css";
import styles from "../../styles/MessageDetail.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Message from "./Message";
import NoResults from "../../assets/no-results.png";

function MessageDetail() {
  const { id } = useParams();
  const [messages, setMessages] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages...");
        const { data } = await axiosReq.get(`/conversations/${id}/`);
        console.log("Fetched messages data:", data);
        setMessages({ results: data.results });
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setHasLoaded(true);
      }
    };

    fetchMessages();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {hasLoaded ? (
          <>
            {messages.results.length ? (
              <InfiniteScroll
                children={messages.results.map((message) => (
                  <Message key={message.id} {...message} setMessages={setMessages} />
                ))}
                dataLength={messages.results.length}
                loader={<Asset spinner />}
                hasMore={!!messages.next}
                next={() => fetchMoreData(messages, setMessages)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message="No messages found." />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* Add any additional components like PopularProfiles here */}
      </Col>
    </Row>
  );
}

export default MessageDetail;
