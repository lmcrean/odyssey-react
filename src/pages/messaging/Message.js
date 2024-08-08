// src/pages/messaging/Message.js

import React, { useEffect } from "react";
import styles from "../../styles/Message.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

const Message = (props) => {
  const {
    id,
    sender,
    sender_profile_image,
    content,
    date,
    time,
    setMessages,
  } = props;

  const currentUser = useCurrentUser();
  useEffect(() => [currentUser]);

  const is_sender = currentUser?.profile_id === sender;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/messages/${id}/delete/`);
      setMessages((prevMessages) => ({
        ...prevMessages,
        results: prevMessages.results.filter((message) => message.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className={styles.Message}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${sender}`}>
            <Avatar src={sender_profile_image} height={55} />
            {sender}
          </Link>
          <div className="d-flex align-items-center">
            <span>{date},</span>
            <span>{time}</span>
            {is_sender && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete</Tooltip>}
              >
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </Button>
              </OverlayTrigger>
            )}
          </div>
        </Media>
        <Card.Text>{content}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Message;
