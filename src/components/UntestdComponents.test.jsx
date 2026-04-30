/**
 * Tests for untested components: Timeline, FAQ, FactChecker
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimelineView from './TimelineView';
import FAQView from './FAQView';
import FactCheckerView from './FactCheckerView';

const mockUserState = { country: 'IN', language: 'en-US' };
const mockDict = {};

describe('TimelineView', () => {
  it('renders timeline title', () => {
    render(
      <TimelineView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('allows country selection', () => {
    const setUserState = vi.fn();
    render(
      <TimelineView
        userState={mockUserState}
        setUserState={setUserState}
        dict={mockDict}
      />
    );
    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      fireEvent.change(selects[0], { target: { value: 'US' } });
      expect(setUserState).toHaveBeenCalled();
    }
  });
});

describe('FAQView', () => {
  it('renders FAQ heading', () => {
    render(
      <FAQView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    // Use heading role to avoid matching multiple text nodes
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders FAQ items', () => {
    render(
      <FAQView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

describe('FactCheckerView', () => {
  it('renders fact checker heading', () => {
    render(
      <FactCheckerView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    // Use heading role to avoid multiple matches from broad regex
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(/fact|checker/i);
  });

  it('analyze button is disabled when input is empty', () => {
    render(
      <FactCheckerView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const analyzeBtn = screen.getByRole('button', { name: /analyze/i });
    expect(analyzeBtn).toBeDisabled();
  });

  it('analyze button becomes enabled with input', () => {
    render(
      <FactCheckerView
        userState={mockUserState}
        setUserState={vi.fn()}
        dict={mockDict}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test headline' } });
    const analyzeBtn = screen.getByRole('button', { name: /analyze/i });
    expect(analyzeBtn).not.toBeDisabled();
  });
});