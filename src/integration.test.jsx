/**
 * Integration tests for chat flow
 * Tests the complete user journey: type message → send → receive AI response
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatView from './components/ChatView';
import { processMessage } from './engine/aiEngine';

vi.mock('./engine/aiEngine', () => ({
  processMessage: vi.fn()
}));

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  localStorage.clear();

  // Mock speechSynthesis
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
    },
  });
  global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
    text, rate: 1, pitch: 1, lang: 'en-US',
    onstart: null, onend: null, onerror: null,
  }));
});

const mockUserState = {
  country: 'IN',
  language: 'en-US',
  isFirstTime: true,
};

const mockDict = {
  welcomeTitle: 'Election Guide Assistant',
  welcomeDesc: 'Your interactive AI guide to understanding elections. Ask me anything!',
  chatPlaceholder: 'Ask anything about elections...',
};

describe('Chat Flow Integration', () => {
  it('sends a message and receives AI response', async () => {
    processMessage.mockReturnValue({ text: 'Mock AI response', detectedCountry: null });

    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'How do I register?' } });

    const sendBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendBtn);

    // User message should appear immediately
    expect(screen.getByText('How do I register?')).toBeInTheDocument();

    // AI response appears after the typing delay
    await waitFor(() => {
      expect(screen.getByText('Mock AI response')).toBeInTheDocument();
    }, { timeout: 3000 });

    // processMessage was called with the user's message and state
    expect(processMessage).toHaveBeenCalledWith(
      'How do I register?',
      mockUserState,
      expect.any(Array)
    );
  });

  it('detects country from response and updates userState', async () => {
    processMessage.mockReturnValue({ text: 'Info for India', detectedCountry: 'IN' });
    const setUserState = vi.fn();

    render(
      <ChatView
        userState={mockUserState}
        setUserState={setUserState}
        dict={mockDict}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'I am from India' } });

    const sendBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(setUserState).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('clears input after sending', () => {
    processMessage.mockReturnValue({ text: 'Response', detectedCountry: null });

    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(textarea.value).toBe('');
  });
});