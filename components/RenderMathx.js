import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Decode HTML entities safely.
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
 * Main processor that handles both raw HTML, LaTeX, and inline text.
 */
function processText(text) {
  if (!text) return [];

  const decoded = decodeHTMLEntities(text.trim());
  const parts = [];

  // If the content contains MathML or HTML tags, treat it as full HTML and render directly.
  if (/<(math|p|img|div|span|br|table|ul|ol|li|h[1-6])[\s>]/i.test(decoded)) {
    parts.push({ type: 'raw-html', content: decoded });
    return parts;
  }

  // Otherwise, handle LaTeX inline/block expressions
  const latexRegex = /(\$\$[^\$]*\$\$|\$[^\$]*\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = latexRegex.exec(decoded)) !== null) {
    const latexExpression = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      const raw = decoded.substring(lastIndex, matchIndex);
      parts.push({ type: 'html-text', content: raw });
    }

    const isBlock = latexExpression.startsWith('$$');
    const strippedExpression = latexExpression.replace(/^\$\$?|\$\$?$/g, '');
    let renderedHtml = '';
    let hasError = false;

    try {
      renderedHtml = katex.renderToString(strippedExpression, {
        throwOnError: false,
        displayMode: isBlock,
      });
      if (renderedHtml.includes('katex-error')) hasError = true;
    } catch (e) {
      hasError = true;
      renderedHtml = `<span class="katex-error" style="color: red;">Invalid LaTeX: ${latexExpression}</span>`;
    }

    parts.push({
      type: hasError ? 'error-latex' : 'latex',
      content: hasError ? latexExpression : renderedHtml,
      rendered: renderedHtml,
    });

    lastIndex = latexRegex.lastIndex;
  }

  if (lastIndex < decoded.length) {
    parts.push({ type: 'html-text', content: decoded.substring(lastIndex) });
  }

  return parts;
}

const RenderMathx = ({ text }) => {
  const processedContent = processText(text);

  return (
    <div className="flex items-start">
      <div className="text-lg leading-relaxed flex-1">
        {processedContent.map((part, index) => {
          if (part.type === 'raw-html') {
            return (
              <div key={index} dangerouslySetInnerHTML={{ __html: part.content }} />
            );
          }
          if (part.type === 'html-text') {
            return <span key={index} dangerouslySetInnerHTML={{ __html: part.content }} />;
          }
          if (part.type === 'latex') {
            return <span key={index} dangerouslySetInnerHTML={{ __html: part.content }} />;
          }
          if (part.type === 'error-latex') {
            return (
              <span
                key={index}
                className="text-red-600 font-mono bg-red-100 p-0.5 rounded"
                dangerouslySetInnerHTML={{ __html: part.rendered }}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default RenderMathx;
