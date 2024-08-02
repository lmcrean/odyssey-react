// pages/messaging/MessageDetail.js

import React from "react";
import styles from "../../styles/MessageDetail.module.css";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import Avatar from "../../components/Avatar";

const MessageDetail = ({ id, username, profile_image, updated_at }) => {
  return (
    <Card className={styles.MessageDetail}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${id}`}>
            <Avatar src={profile_image} height={55} />
            {username}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
          </div>
        </Media>
      </Card.Body>
    </Card>
  );
};

export default MessageDetail;