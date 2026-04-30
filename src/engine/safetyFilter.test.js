/**
 * Unit tests for safetyFilter.js
 * Ensures the safety filter correctly blocks political opinion requests.
 */
import { describe, it, expect } from 'vitest';
import { isSafetyViolation, SAFETY_RESPONSE } from '../engine/safetyFilter';

describe('isSafetyViolation', () => {
  // ─── Should BLOCK ──────────────────────────────────────────────────────────
  it('blocks "who should I vote for"', () => {
    expect(isSafetyViolation('who should I vote for?')).toBe(true);
  });

  it('blocks "best candidate" queries', () => {
    expect(isSafetyViolation('who is the best candidate?')).toBe(true);
    expect(isSafetyViolation('which is the best party?')).toBe(true);
  });

  it('blocks "which party" queries', () => {
    expect(isSafetyViolation('which party should I vote for?')).toBe(true);
  });

  it('blocks opinion requests', () => {
    expect(isSafetyViolation('what is your opinion on this party?')).toBe(true);
    expect(isSafetyViolation('what is your view on this politician?')).toBe(true);
  });

  it('blocks support/preference questions', () => {
    expect(isSafetyViolation('do you support this leader?')).toBe(true);
    expect(isSafetyViolation('do you prefer the Democrats?')).toBe(true);
  });

  it('blocks "should X win/lose" queries', () => {
    expect(isSafetyViolation('should he win the election?')).toBe(true);
    expect(isSafetyViolation('should she lose?')).toBe(true);
  });

  it('blocks "favorite candidate/party" queries', () => {
    expect(isSafetyViolation('who is your favorite candidate?')).toBe(true);
    expect(isSafetyViolation('what is your favorite party?')).toBe(true);
  });

  // ─── Should ALLOW ──────────────────────────────────────────────────────────
  it('allows "how do I register to vote"', () => {
    expect(isSafetyViolation('how do I register to vote?')).toBe(false);
  });

  it('allows "what documents do I need"', () => {
    expect(isSafetyViolation('what documents do I need to vote?')).toBe(false);
  });

  it('allows "what happens on election day"', () => {
    expect(isSafetyViolation('what happens on election day?')).toBe(false);
  });

  it('allows "explain the election process"', () => {
    expect(isSafetyViolation('explain the election process')).toBe(false);
  });

  it('allows neutral greetings', () => {
    expect(isSafetyViolation('hello')).toBe(false);
    expect(isSafetyViolation('thanks')).toBe(false);
  });
});

describe('SAFETY_RESPONSE', () => {
  it('is a non-empty string', () => {
    expect(typeof SAFETY_RESPONSE).toBe('string');
    expect(SAFETY_RESPONSE.length).toBeGreaterThan(0);
  });

  it('contains a refusal message', () => {
    expect(SAFETY_RESPONSE).toContain("can't help with that");
  });
});
