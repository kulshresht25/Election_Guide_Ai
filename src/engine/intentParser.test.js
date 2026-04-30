/**
 * Unit tests for intentParser.js
 * Tests country detection, context extraction, and intent matching.
 */
import { describe, it, expect } from 'vitest';
import {
  detectCountry,
  extractUserContext,
  parseIntent,
} from '../engine/intentParser';

// ─── detectCountry ────────────────────────────────────────────────────────────
describe('detectCountry', () => {
  it('detects India', () => {
    expect(detectCountry('I live in India')).toBe('IN');
    expect(detectCountry('Bharat voter rules')).toBe('IN');
  });

  it('detects USA', () => {
    expect(detectCountry('I am from USA')).toBe('US');
    expect(detectCountry('United States election')).toBe('US');
    expect(detectCountry('America voting')).toBe('US');
  });

  it('detects United Kingdom', () => {
    expect(detectCountry('UK election')).toBe('UK');
    expect(detectCountry('I live in Britain')).toBe('UK');
  });

  it('detects Canada', () => {
    expect(detectCountry('Canadian voter registration')).toBe('CA');
  });

  it('detects Australia', () => {
    expect(detectCountry('Australia voting rules')).toBe('AU');
    expect(detectCountry('Aussie election')).toBe('AU');
  });

  it('returns null for unknown country', () => {
    expect(detectCountry('Tell me about voting')).toBeNull();
    expect(detectCountry('')).toBeNull();
  });
});

// ─── extractUserContext ───────────────────────────────────────────────────────
describe('extractUserContext', () => {
  it('flags questions', () => {
    expect(extractUserContext('How do I register?').isQuestion).toBe(true);
    expect(extractUserContext('What documents do I need?').isQuestion).toBe(true);
  });

  it('flags casual tone', () => {
    expect(extractUserContext('Hey, thanks!').isCasual).toBe(true);
    expect(extractUserContext('Hi there').isCasual).toBe(true);
  });

  it('flags online mentions', () => {
    expect(extractUserContext('Can I register online?').mentionsOnline).toBe(true);
    expect(extractUserContext('website for voter registration').mentionsOnline).toBe(true);
  });

  it('flags deadline mentions', () => {
    expect(extractUserContext('What is the registration deadline?').mentionsDeadline).toBe(true);
    expect(extractUserContext('last date to register').mentionsDeadline).toBe(true);
  });

  it('flags age mentions', () => {
    expect(extractUserContext('What age do I need to vote?').mentionsAge).toBe(true);
    expect(extractUserContext('I am 18 years old').mentionsAge).toBe(true);
  });

  it('flags fee mentions', () => {
    expect(extractUserContext('Is there a fee to register?').mentionsFee).toBe(true);
    expect(extractUserContext('Is it free?').mentionsFee).toBe(true);
  });
});

// ─── parseIntent ──────────────────────────────────────────────────────────────
describe('parseIntent', () => {
  it('matches registration intent', () => {
    expect(parseIntent('How do I register to vote?')).toBe('registration');
    expect(parseIntent('voter registration process')).toBe('registration');
    expect(parseIntent('sign up to vote')).toBe('registration');
  });

  it('matches documents intent', () => {
    expect(parseIntent('What documents do I need to vote?')).toBe('documents');
    expect(parseIntent('What ID do I need?')).toBe('documents');
    expect(parseIntent('voter id requirements')).toBe('documents');
  });

  it('matches votingDay intent', () => {
    expect(parseIntent('What happens on voting day?')).toBe('votingDay');
    expect(parseIntent('How do I cast my vote?')).toBe('votingDay');
    expect(parseIntent('election day process')).toBe('votingDay');
  });

  it('matches firstTime intent', () => {
    expect(parseIntent("I'm a first-time voter")).toBe('firstTime');
    expect(parseIntent('I have never voted before')).toBe('firstTime');
  });

  it('matches process intent', () => {
    expect(parseIntent('Explain the election process step by step')).toBe('process');
    expect(parseIntent('How does the election work?')).toBe('process');
  });

  it('matches greeting intent', () => {
    expect(parseIntent('Hello')).toBe('greeting');
    expect(parseIntent('Hi there!')).toBe('greeting');
  });

  it('matches thanks intent', () => {
    expect(parseIntent('Thanks!')).toBe('thanks');
    expect(parseIntent('Thank you')).toBe('thanks');
  });

  it('matches help intent', () => {
    expect(parseIntent('What can you do?')).toBe('help');
    expect(parseIntent('help me')).toBe('help');
  });

  it('returns null for unmatched input', () => {
    expect(parseIntent('What is the weather today?')).toBeNull();
  });
});
