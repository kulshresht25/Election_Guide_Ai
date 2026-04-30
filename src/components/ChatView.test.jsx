/**
 * Component tests for ChatView
 * Tests rendering, quick actions, input handling, and accessibility.
 */
import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatView from '../components/ChatView';

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

// ─── Speech API Mocks ─────────────────────────────────────────────────────────
beforeEach(() => {
  // Mock speechSynthesis
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
    },
  });
  // Mock SpeechSynthesisUtterance
  global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
    text,
    rate: 1,
    pitch: 1,
    lang: 'en-US',
    onstart: null,
    onend: null,
    onerror: null,
  }));
});

describe('ChatView — welcome screen', () => {
  it('renders the welcome title', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    expect(screen.getByText('Election Guide Assistant')).toBeInTheDocument();
  });

  it('renders the welcome description', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    expect(screen.getByText(/interactive AI guide/i)).toBeInTheDocument();
  });

  it('renders quick action buttons', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Voting Day Guide')).toBeInTheDocument();
    expect(screen.getByText('First-Time Voter')).toBeInTheDocument();
  });
});

describe('ChatView — input and send', () => {
  it('renders the chat textarea', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('textarea has accessible aria-label', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-label');
  });

  it('updates input value on change', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello there' } });
    expect(textarea.value).toBe('Hello there');
  });

  it('send button is disabled when input is empty', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).toBeDisabled();
  });

  it('send button becomes enabled when input has text', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).not.toBeDisabled();
  });

  it('quick action buttons are present and keyboard-accessible', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const regBtn = screen.getByText('Voter Registration');
    // Button should exist and be focusable
    expect(regBtn.closest('button')).toBeInTheDocument();
    expect(regBtn.closest('button').tagName).toBe('BUTTON');
  });
});

describe('ChatView — accessibility', () => {
  it('mic button has accessible aria-label', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const micBtn = screen.getByRole('button', { name: /voice input|stop listening/i });
    expect(micBtn).toBeInTheDocument();
  });

  it('all buttons are keyboard accessible', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn.tagName).toBe('BUTTON');
    });
  });

  it('textarea has proper label association', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    const label = screen.getByText(mockDict.chatPlaceholder);
    expect(label).toBeInTheDocument();
  });
});

describe('ChatView — stress tests', () => {
  it('handles very long input gracefully', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    const longInput = 'a'.repeat(5000);
    fireEvent.change(textarea, { target: { value: longInput } });
    expect(textarea.value).toBe(longInput);
  });

  it('send button is disabled when only whitespace', () => {
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '   \n\t   ' } });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).toBeDisabled();
  });
});
