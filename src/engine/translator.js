/**
 * translator.js
 * Utility for translating text and HTML using a free Google Translate endpoint.
 */

export async function translateText(text, targetLang, sourceLang = 'auto') {
  if (!text || !targetLang) return text;

  const target = targetLang.split('-')[0];
  const source = sourceLang === 'auto' ? 'auto' : sourceLang.split('-')[0];

  // If source and target are the same, don't translate
  if (source !== 'auto' && source === target) return text;

  // Don't translate if it's already English and we want English
  if (target === 'en' && !text.match(/[^\x00-\x7F]/)) return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Translation failed');

    const data = await response.json();
    if (data && data[0]) {
      return data[0].map(s => s[0]).join('');
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

/**
 * Translates HTML content while attempting to preserve tags.
 * We'll use a safer approach that sends segments of text to translate
 * and keeps the HTML structure intact.
 */
export async function translateHTML(html, targetLang) {
  if (!html || !targetLang) return html;
  const target = targetLang.split('-')[0];
  if (target === 'en') return html;

  try {
    // If we're in a browser, use DOMParser for cleaner translation
    if (typeof document !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const walk = async (node) => {
        if (node.nodeType === 3) { // Text node
          const originalText = node.nodeValue;
          if (originalText.trim().length > 0) {
            node.nodeValue = await translateText(originalText, target, 'en');
          }
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            await walk(node.childNodes[i]);
          }
        }
      };

      await walk(doc.body);
      return doc.body.innerHTML;
    }

    // Fallback for non-browser environments
    return await translateText(html, targetLang, 'en');
  } catch (error) {
    console.error('HTML translation error:', error);
    return html;
  }
}
