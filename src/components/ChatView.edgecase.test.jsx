/**
 * Advanced edge case tests for ChatView and input handling
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatView from './ChatView';

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

describe('ChatView — localStorage persistence edge cases', () => {
  it('recovers from corrupted localStorage', () => {
    localStorage.setItem('election-guide-messages', 'INVALID_JSON');
    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    expect(screen.getByText('Election Guide Assistant')).toBeInTheDocument();
  });

  it('loads persisted messages and shows them', () => {
    const messages = [
      { id: 1, role: 'user', text: 'Hello', time: new Date().toISOString() },
      { id: 2, role: 'assistant', text: '<p>Hi there!</p>', time: new Date().toISOString() },
    ];
    localStorage.setItem('election-guide-messages', JSON.stringify(messages));

    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('limits stored messages to last 20 on load', () => {
    const messages = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      role: 'user',
      text: `Message ${i}`,
      time: new Date().toISOString(),
    }));

    localStorage.setItem('election-guide-messages', JSON.stringify(messages));

    render(
      <ChatView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );

    // Should NOT show early messages (only last 20 are loaded)
    expect(screen.queryByText('Message 0')).not.toBeInTheDocument();
    // Should show recent messages
    expect(screen.getByText('Message 49')).toBeInTheDocument();
  });
});

describe('ChatView — language switching edge cases', () => {
  it('switches language mid-conversation', () => {
    const setUserState = vi.fn();
    const { rerender } = render(
      <ChatView
        userState={mockUserState}
        setUserState={setUserState}
        dict={mockDict}
      />
    );

    // Simulate language change
    const newUserState = { ...mockUserState, language: 'es-ES' };
    rerender(
      <ChatView
        userState={newUserState}
        setUserState={setUserState}
        dict={mockDict}
      />
    );

    expect(screen.getByText('Election Guide Assistant')).toBeInTheDocument();
  });
});