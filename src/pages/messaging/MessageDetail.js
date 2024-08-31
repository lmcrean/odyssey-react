import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import appStyles from "../../App.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Message from "./Message";
import NoResults from "../../assets/no-results.png";
import MessageDetailSendForm from "./MessageDetailSendForm";
import styles from "../../styles/modules/MessageDetail.module.css";

function MessageDetail() {
  const { id } = useParams();
  const history = useHistory();
  const [recipientUsername, setRecipientUsername] = useState("");
  const [messages, setMessages] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosReq.get(`/messages/${id}/`);

        setMessages({ results: data.results });
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setHasLoaded(true);
      }
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    const fetchRecipientUsername = async () => {
      try {
        const { data } = await axiosReq.get(`/users/${id}/`);
        setRecipientUsername(data.username);
      } catch (err) {
        // Graceful error handling
        setRecipientUsername("Unknown user"); // Fallback if the fetch fails
      }
    };
  
    fetchRecipientUsername();
  }, [id]);
  

  const handleDeleteChat = async () => {
    try {
      await axiosRes.delete(`/chats/${id}/delete/`);
      history.push('/messages');
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((message) => {
      const date = message.date;
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages.results);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {hasLoaded ? (
          <>
            {messages.results.length ? (
              <InfiniteScroll
                children={Object.entries(groupedMessages).map(([date, msgs]) => {
                  return (
                    <div key={date}>
                      <div className={`${styles.DateSeparator} d-flex align-items-center justify-content-center`}>
                        <span className={styles.DateBubble}>{date}</span>
                      </div>
                      {msgs.map((message, index) => {
                        // Determine whether to show the avatar based on consecutive messages
                        const isPreviousFromSameSender = index > 0 && messages.results[index - 1].sender === message.sender;
                        const isBegin = !isPreviousFromSameSender;
                        return (
                          <div key={message.id} className={`${styles.MessageWrapper} ${message.is_sender ? styles.SenderWrapper : styles.RecipientWrapper}`}>
                            <Message
                              {...message}
                              sender={message.sender} 
                              sender_profile_id={message.sender}
                              recipient={message.recipient}
                              recipientUsername={recipientUsername}
                              showAvatar={!isPreviousFromSameSender}
                              isPreviousFromSameSender={isPreviousFromSameSender}
                              setMessages={setMessages}
                            />
                            <div className={`${styles.MessageTriangle} ${message.is_sender ? styles.SenderMessage : styles.RecipientMessage}`} style={{ display: isBegin ? 'block' : 'none' }}></div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
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
        <MessageDetailSendForm setMessages={setMessages} />
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <h2>Chat with {recipientUsername}</h2>
        <Link to="/messages">
          <Button variant="primary">
            <i className="fas fa-arrow-left"></i> Back to Messages
          </Button>
        </Link><br></br>
        <Button variant="danger" className="ml-2 mt-5" onClick={handleShowModal}>
          Delete Chat
        </Button>
      </Col>
      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this chat?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteChat}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}

export default MessageDetail;