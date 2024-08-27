import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons';

function MessageDetailSendForm({ setMessages }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    content: "",
    image: null,
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
      setFormData({
        ...formData,
        image: event.target.files[0],
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("content", content);
    if (image) {
      formDataToSend.append("image", image);
    }
    
    try {
      const { data } = await axiosReq.post(`/messages/${id}/send/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log('Message sent successfully:', data);
  
      setMessages(prevMessages => ({
        ...prevMessages,
        results: [...prevMessages.results, data],
      }));
  
      setFormData({ content: "", image: null });
      if (imageInput?.current) {
        imageInput.current.value = "";
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setErrors(err.response?.data || {});
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            name="content"
            value={content}
            onChange={handleChange}
            placeholder="Type your message here..."
          />
        </Form.Group>

        <Form.Group>
          <Form.File
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInput}
            label={image ? "Image selected" : "Upload Image"}
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
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default MessageDetailSendForm;