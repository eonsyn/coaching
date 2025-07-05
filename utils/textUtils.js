// lib/textUtils.js

export function decodeHTMLEntities(text) {
  return text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * Strip all LaTeX, MathML, and HTML tags for plain clean PDF text.
 */
export function extractPlainText(text) {
  if (!text) return '';

  // Decode HTML entities first
  let decoded = decodeHTMLEntities(text.trim());

  // Remove HTML tags like <math>, <p>, etc.
  decoded = decoded.replace(/<[^>]*>/g, '');

  // Remove LaTeX $...$ and similar
  decoded = decoded
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\\(/g, '')
    .replace(/\\\)/g, '')
    .replace(/\\\[|\]/g, '')
    .replace(/\\text/g, '')
    .replace(/\\,/g, ' ')
    .replace(/\\\\/g, '\n');

  return decoded.trim();
}
