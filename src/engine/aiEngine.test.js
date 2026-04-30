/**
 * Integration tests for aiEngine.js processMessage()
 * Tests the full pipeline: input → safety → intent → response.
 */
import { describe, it, expect } from 'vitest';
import { processMessage } from '../engine/aiEngine';

const defaultUserState = { country: 'IN', language: 'en-US', isFirstTime: true };

describe('processMessage — safety filter', () => {
  it('returns safety response for political opinion requests', () => {
    const result = processMessage('who should I vote for?', defaultUserState);
    expect(result.text).toContain("can't help with that");
    expect(result.detectedCountry).toBeNull();
  });

  it('returns safety response for candidate preference questions', () => {
    const result = processMessage('who is the best candidate?', defaultUserState);
    expect(result.text).toContain("can't help with that");
  });
});

describe('processMessage — country detection', () => {
  it('detects India from message', () => {
    const result = processMessage('I am from India', defaultUserState);
    expect(result.detectedCountry).toBe('IN');
  });

  it('detects USA from message', () => {
    const result = processMessage('I am from USA', defaultUserState);
    expect(result.detectedCountry).toBe('US');
  });

  it('returns null detectedCountry for no country mention', () => {
    const result = processMessage('How do I register to vote?', defaultUserState);
    expect(result.detectedCountry).toBeNull();
  });
});

describe('processMessage — intent responses', () => {
  it('responds to voter registration queries', () => {
    const result = processMessage('How do I register to vote?', defaultUserState);
    expect(result.text).toBeTruthy();
    expect(typeof result.text).toBe('string');
    expect(result.text.length).toBeGreaterThan(50);
  });

  it('responds to document queries', () => {
    const result = processMessage('What documents do I need to vote?', defaultUserState);
    expect(result.text).toBeTruthy();
    expect(result.text).toContain('Document');
  });

  it('responds to voting day queries', () => {
    const result = processMessage('What happens on voting day?', defaultUserState);
    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(50);
  });

  it('responds to first-time voter queries', () => {
    const result = processMessage("I'm a first-time voter", defaultUserState);
    expect(result.text).toBeTruthy();
    expect(result.text).toContain('First-Time');
  });

  it('responds to election process queries', () => {
    const result = processMessage('Explain the election process step by step', defaultUserState);
    expect(result.text).toBeTruthy();
    expect(result.text).toContain('Election Process');
  });

  it('responds to greeting', () => {
    const result = processMessage('Hello', defaultUserState);
    expect(result.text).toBeTruthy();
    expect(result.text).toMatch(/hello|welcome|hi/i);
  });

  it('responds to thanks', () => {
    const result = processMessage('Thank you!', defaultUserState);
    expect(result.text).toBeTruthy();
    // The thanks response contains a generic positive phrase
    expect(result.text.length).toBeGreaterThan(20);
  });

  it('responds to help query', () => {
    const result = processMessage('What can you do?', defaultUserState);
    expect(result.text).toBeTruthy();
    expect(result.text).toContain('Election Guide');
  });
});

describe('processMessage — edge cases', () => {
  it('handles empty input gracefully', () => {
    const result = processMessage('', defaultUserState);
    expect(result.text).toContain('Voter Registration');
    expect(result.detectedCountry).toBeNull();
  });

  it('handles whitespace-only input', () => {
    const result = processMessage('   ', defaultUserState);
    expect(result.text).toContain('Voter Registration');
  });
});

describe('processMessage — country-specific responses', () => {
  it('tailors response for USA', () => {
    const usState = { ...defaultUserState, country: 'US' };
    const result = processMessage('How do I register to vote?', usState);
    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(50);
  });

  it('tailors response for UK', () => {
    const ukState = { ...defaultUserState, country: 'UK' };
    const result = processMessage('What documents do I need?', ukState);
    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(50);
  });
});

describe('processMessage — fallback', () => {
  it('returns fallback for unrecognized input', () => {
    const result = processMessage('xyzzy gibberish nothing', defaultUserState);
    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(10);
  });
});
