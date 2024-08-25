import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'; // Added act here
import Message from '../Message';
import { useCurrentUser } from '../../../contexts/CurrentUserContext';
import { axiosRes } from '../../../api/axiosDefaults';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

// Mocking the current user context
jest.mock('../../../contexts/CurrentUserContext', () => ({
  useCurrentUser: jest.fn(),
}));

// Mocking axiosRes
jest.mock('../../../api/axiosDefaults', () => ({
  axiosRes: {
    delete: jest.fn(),
    patch: jest.fn(),
    get: jest.fn(),
  },
}));

describe('Message Component', () => {
  const setMessagesMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCurrentUser.mockReturnValue({ profile_id: 1 }); // Default mock for current user
  });

  it('fetches sender username', async () => {
    // Ensure proper mock response
    axiosRes.get.mockResolvedValueOnce({
      data: { username: 'sender_username' },
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Message
            id={1}
            sender={1}
            sender_profile_id={1}
            sender_profile_image="profile_image_url"
            content="Test message"
            date="01 Jan 2023"
            time="12:00"
            setMessages={setMessagesMock}
            showAvatar={true}
          />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText('sender_username')).toBeInTheDocument();
  });

  it('handles fetch sender username failure gracefully', async () => {
    // Mock rejected response for failure scenario
    axiosRes.get.mockRejectedValueOnce(new Error('Failed to fetch sender username'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <MemoryRouter>
          <Message
            id={1}
            sender={1}
            sender_profile_id={1}
            sender_profile_image="profile_image_url"
            content="Test message"
            date="01 Jan 2023"
            time="12:00"
            setMessages={setMessagesMock}
            showAvatar={true}
          />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch sender username:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('opens and closes the delete modal properly', async () => {
    render(
      <MemoryRouter>
        <Message
          id={1}
          sender={1}
          sender_profile_id={1}
          sender_profile_image="profile_image_url"
          content="Test message"
          date="01 Jan 2023"
          time="12:00"
          setMessages={setMessagesMock}
          showAvatar={true}
        />
      </MemoryRouter>
    );

    // Simulate clicking the card's Delete button to show the modal
    fireEvent.click(screen.getByTestId('delete-button-card'));

    // Check if the modal opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Simulate cancel button click
    fireEvent.click(screen.getByText('Cancel'));

    // Ensure modal close happens after state update
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
