// src/pages/messaging/MessageDetailSendForm.js

import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; 

function MessageDetailSendForm({ setMessages }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    content: "",
    image: "",
  });
  const { content, image } = formData;
  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);  // Clean up previous image
      setFormData({
        ...formData,
        image: URL.createObjectURL(event.target.files[0]),  // Create URL for the new image
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      console.log('Attempting to send message...');
      
      // Create FormData and send it
      const formData = new FormData();
      formData.append("content", formData.content);
      formData.append("image", formData.image);
      
      const response = await axios.post("/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log('Message sent successfully:', response.data);
  
      // Reset form
      setFormData({ content: "", image: "" });
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
            name="content"
            value={content}
            onChange={handleChange}
            placeholder="Type your message here..."
          />
        </Form.Group>

        {/* Image preview and file input */}
        <Form.Group>
          {image ? (
            <div className="text-center">
              <Image src={image} rounded fluid />
              <Button
                variant="secondary"
                onClick={() => imageInput.current.click()}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <Form.Label htmlFor="image-upload" className="d-flex justify-content-center">
              <FontAwesomeIcon icon={faImage} /> Click to Upload Image
            </Form.Label>
          )}

          <Form.File
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInput}
            className="d-none"
          />
        </Form.Group>

        {errors?.content?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
        {errors?.image?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => imageInput.current.click()}>
            <FontAwesomeIcon icon={faImage} /> Add Image
          </Button>
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default MessageDetailSendForm;
