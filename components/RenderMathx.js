// components/RenderMathx.jsx (or .js) 
// components/RenderMathx.jsx (Server Component)
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Decode HTML entities in a server-safe way.
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
 * Process LaTeX and text parts from input
 */
function processText(text) {
  const parts = [];
  const latexRegex = /(\$\$[^\$]*\$\$|\$[^\$]*\$)/g;
  const decoded = decodeHTMLEntities(text?.trim() || '');
  let lastIndex = 0;
  let match;

  while ((match = latexRegex.exec(decoded)) !== null) {
    const latexExpression = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push({ type: 'text', content: decoded.substring(lastIndex, matchIndex) });
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

    if (hasError) {
      parts.push({ type: 'error-latex', content: latexExpression, rendered: renderedHtml });
    } else {
      parts.push({ type: 'latex', content: renderedHtml });
    }

    lastIndex = latexRegex.lastIndex;
  }

  if (lastIndex < decoded.length) {
    parts.push({ type: 'text', content: decoded.substring(lastIndex) });
  }

  return parts;
}

/**
 * @param {{ text: string }} props
 */
const RenderMathx = ({ text }) => {
  const processedContent = processText(text);

  return (
    <div className="flex items-start">
      <div className="text-lg leading-relaxed flex-1">
        {processedContent.map((part, index) => {
          if (part.type === 'text') {
            return <span key={index}>{part.content}</span>;
          } else if (part.type === 'latex') {
            return <span key={index} dangerouslySetInnerHTML={{ __html: part.content }} />;
          } else if (part.type === 'error-latex') {
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
