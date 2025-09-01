import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Convert special HTML entities to proper characters.
 */
function decodeHTMLEntities(text) {
  return text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
             .replace(/&nbsp;/g, ' ')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&amp;/g, '&')
             .replace(/&quot;/g, '"')
             .replace(/&apos;/g, "'");
}

/**
 * Split and process the string to handle raw HTML, MathML, and LaTeX
 */
function processText(text) {
  const decoded = decodeHTMLEntities(text.trim());
  const parts = [];

  // If full HTML or MathML is detected, render as is
  if (/<(math|p|img|div|span|br|table|ul|ol|li|h[1-6])[\s>]/i.test(decoded)) {
    parts.push({ type: 'raw-html', content: decoded });
    return parts;
  }

  const latexRegex = /(\$\$[^\$]*\$\$|\$[^\$]*\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = latexRegex.exec(decoded)) !== null) {
    const latex = match[0];
    const start = match.index;

    // Add preceding text
    if (start > lastIndex) {
      parts.push({ type: 'text', content: decoded.slice(lastIndex, start) });
    }

    const isBlock = latex.startsWith('$$');
    const expression = latex.replace(/^\$\$?|\$\$?$/g, '');

    try {
      const html = katex.renderToString(expression, {
        displayMode: isBlock,
        throwOnError: false,
      });
      parts.push({ type: 'latex', content: html });
    } catch (err) {
      parts.push({ type: 'error', content: `Error: ${latex}` });
    }

    lastIndex = latexRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < decoded.length) {
    parts.push({ type: 'text', content: decoded.slice(lastIndex) });
  }

  return parts;
}

const RenderMathx = ({ text }) => {
  const parts = processText(text);

  return (
    <div className="leading-relaxed  text-base text-[var(--foreground)]">
      {parts.map((part, i) => {
        if (part.type === 'raw-html') {
          return <div key={i} className='' dangerouslySetInnerHTML={{ __html: part.content }} />;
        }
        if (part.type === 'latex') {
          return (
            <span
              key={i}
              className="px-1"
              dangerouslySetInnerHTML={{ __html: part.content }}
            />
          );
        }
        if (part.type === 'text') {
          return <span key={i}>{part.content}</span>;
        }
        if (part.type === 'error') {
          return (
            <span key={i} className="text-red-500 font-mono">
              {part.content}
            </span>
          );
        }
        return null;
      })}
    </div>
  );
};

export default RenderMathx;
