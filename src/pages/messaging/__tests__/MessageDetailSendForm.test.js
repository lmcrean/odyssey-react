import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MessageDetailSendForm from "../MessageDetailSendForm";
import { MemoryRouter } from "react-router-dom";

// Mock axios
jest.mock("axios");

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => "mockedImageURL");
global.URL.revokeObjectURL = jest.fn();

describe("MessageDetailSendForm", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should submit a message with image successfully", async () => {
    // Mock axios.post success response
    axios.post.mockResolvedValueOnce({
      data: { message: 'Success' }
    });

    render(
      <MemoryRouter>
        <MessageDetailSendForm setMessages={jest.fn()} />
      </MemoryRouter>
    );

    // Simulate typing in the message
    fireEvent.change(screen.getByPlaceholderText("Type your message here..."), {
      target: { value: "Test message with image" }
    });

    // Simulate selecting an image file
    const file = new File(["image-content"], "test-image.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByLabelText(/Click to Upload Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Simulate clicking the send button
    fireEvent.click(screen.getByText(/Send/i));

    // Wait for axios.post to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Check if axios.post was called with the correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    );
  });
});