// src/pages/messaging/MessageDetailSendForm.js

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";

function MessageDetailSendForm({ setMessages }) {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    

    try {
      const { data } = await axiosRes.post(`/messages/${id}/send/`, {
        content: content,
      });
      

      setMessages((prevMessages) => ({
        ...prevMessages,
        results: [...prevMessages.results, data],
      }));
      setContent("");
    } catch (err) {
      console.error("Error sending message:", err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>New Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={handleChange}
          />
        </Form.Group>
        {errors?.content?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
}

export default MessageDetailSendForm;
