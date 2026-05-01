import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translateText, translateHTML } from './translator';

// Mock fetch globally
global.fetch = vi.fn();

describe('translator utility', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should return original text if target language is English', async () => {
    const result = await translateText('Hello', 'en-US');
    expect(result).toBe('Hello');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should call google translate API for non-English languages', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [[['Hola', 'Hello']]],
    });

    const result = await translateText('Hello', 'es-ES');
    expect(result).toBe('Hola');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('tl=es'));
  });

  it('should handle API errors gracefully and return original text', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await translateText('Hello', 'fr-FR');
    expect(result).toBe('Hello');
  });

  it('should translate HTML content', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [[['<h4>Hola</h4>', '<h4>Hello</h4>']]],
    });

    const result = await translateHTML('<h4>Hello</h4>', 'es-ES');
    expect(result).toBe('<h4>Hola</h4>');
  });
});
