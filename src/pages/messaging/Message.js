import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/Message.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

const Message = (props) => {
  const {
    id,
    sender,
    sender_profile_id,
    sender_profile_image,
    content,
    date,
    time,
    setMessages,
    showAvatar,
  } = props;

  const currentUser = useCurrentUser();
  const [showFullTimestamp, setShowFullTimestamp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [senderUsername, setSenderUsername] = useState("");
  const [loadingUsername, setLoadingUsername] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Reset newContent if content prop changes
  useEffect(() => {
    setNewContent(content);
  }, [content]);

  // Fetch the sender's username
  useEffect(() => {
    const fetchSenderUsername = async () => {
      try {
        const response = await axiosRes.get(`/users/${sender}/`);
        if (response && response.data && response.data.username) {
          setSenderUsername(response.data.username);
          setFetchError(false); // Clear any previous errors on successful fetch
        } else {
          throw new Error('Invalid response data');
        }
      } catch (err) {
        setFetchError(true); // Set error state to true on failure
      } finally {
        setLoadingUsername(false);
      }
    };
  
    if (showAvatar) {
      fetchSenderUsername();
    }
  }, [sender, showAvatar]);

  // Safeguard comparison to avoid potential issues with undefined/null values
  const is_sender = currentUser && currentUser.pk && sender_profile_id
    ? currentUser.pk.toString() === sender_profile_id.toString()
    : false;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/messages/${id}/delete/`);
      setMessages((prevMessages) => ({
        ...prevMessages,
        results: prevMessages.results.filter((message) => message.id !== id),
      }));
      setShowDeleteModal(false);
    } catch (err) {
      // Handle the error gracefully
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await axiosRes.patch(`/messages/${id}/update/`, { content: newContent });
      setMessages((prevMessages) => ({
        ...prevMessages,
        results: prevMessages.results.map((message) =>
          message.id === id ? { ...message, content: data.content } : message
        ),
      }));
      setIsEditing(false);
    } catch (err) {
      // Handle the error gracefully
    }
  };

  const handleMouseEnter = () => setShowFullTimestamp(true);
  const handleMouseLeave = () => setShowFullTimestamp(false);

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <Card className={is_sender ? styles.senderMessage : styles.recipientMessage}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          {showAvatar && (
            <Link to={`/profiles/${sender_profile_id}`}>
              <Avatar src={sender_profile_image} height={55} />
              {loadingUsername ? (
                <small className="text-muted">Loading...</small>
              ) : fetchError ? (
                <small className="text-muted">Failed to load username</small>
              ) : (
                <small className="text-muted">{senderUsername}</small>
              )}
            </Link>
          )}
          <div className="d-flex align-items-center">
            <span
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {showFullTimestamp ? `${date} ${time}` : time}
            </span>
            {is_sender && (
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Edit</Tooltip>}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    style={{ marginLeft: "10px" }}
                  >
                    Edit
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Delete</Tooltip>}
                >
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleShowDeleteModal}
                    style={{ marginLeft: "10px" }}
                    data-testid="delete-button-card"
                  >
                    Delete
                  </Button>
                </OverlayTrigger>
              </>
            )}
          </div>
        </Media>
        {isEditing ? (
          <>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className={styles.EditTextarea}
            />
            <Button onClick={handleEdit} className="mt-2" variant="success" size="sm">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} className="mt-2 ml-2" variant="secondary" size="sm">
              Cancel
            </Button>
          </>
        ) : (
          <Card.Text>{content}</Card.Text>
        )}

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton aria-label="Close modal">
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this message?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} data-testid="delete-button-modal">
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default Message;
