// components/QuestionDisplay.jsx (or .js)

import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

/**
 * @typedef {object} QuestionDisplayProps
 * @property {string} question - The single question string to display, potentially containing LaTeX.
 */

/**
 * A React component to display a single mathematical problem with KaTeX rendering,
 * highlighting KaTeX errors.
 * @param {QuestionDisplayProps} props
 * @returns {JSX.Element}
 */
const QuestionDisplay = ({ question }) => {
  // State to store the processed parts (text or rendered KaTeX HTML)
  const [processedContent, setProcessedContent] = useState([]);

  useEffect(() => {
    const parts = [];
    // Regex to find LaTeX expressions ($...$ or $$...$$) and capture the text around them
    const latexRegex = /(\$\$[^\$]*\$\$|\$[^\$]*\$)/g;
    let lastIndex = 0;

    // Use a temporary div to decode HTML entities for the *entire* question string first
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = question.trim();
    const decodedQuestion = tempDiv.textContent || tempDiv.innerText;

    // Iterate through matches to split the string into plain text and LaTeX parts
    let match;
    while ((match = latexRegex.exec(decodedQuestion)) !== null) {
      const latexExpression = match[0];
      const matchIndex = match.index;

      // Add the plain text before the current LaTeX expression
      if (matchIndex > lastIndex) {
        parts.push({ type: 'text', content: decodedQuestion.substring(lastIndex, matchIndex) });
      }

      // Process the LaTeX expression
      const isBlock = latexExpression.startsWith('$$');
      const strippedExpression = latexExpression.replace(/^\$\$?|\$\$?$/g, '');
      let renderedHtml = '';
      let hasError = false;

      try {
        renderedHtml = katex.renderToString(strippedExpression, {
          throwOnError: false, // Important: don't throw, let KaTeX output error HTML
          displayMode: isBlock,
        });

        // KaTeX injects 'katex-error' class if there's an error
        if (renderedHtml.includes('katex-error')) {
          hasError = true;
        }

      } catch (e) {
        console.error('KaTeX rendering error (outer catch):', e, 'for expression:', latexExpression);
        hasError = true;
        // Fallback HTML if an unexpected error occurs during KaTeX.renderToString
        renderedHtml = `<span class="katex-error" style="color: red;">Invalid LaTeX: ${latexExpression}</span>`;
      }

      if (hasError) {
        // If there's a KaTeX error, render the original LaTeX within a styled span
        // We ensure a common styling class for direct KaTeX errors.
        parts.push({ type: 'error-latex', content: latexExpression, rendered: renderedHtml });
      } else {
        // Otherwise, use the successfully rendered HTML from KaTeX
        parts.push({ type: 'latex', content: renderedHtml });
      }

      lastIndex = latexRegex.lastIndex;
    }

    // Add any remaining plain text after the last LaTeX expression
    if (lastIndex < decodedQuestion.length) {
      parts.push({ type: 'text', content: decodedQuestion.substring(lastIndex) });
    }

    setProcessedContent(parts);
  }, [question]); // Re-run when the 'question' string changes

  return (

    <div className="flex items-start">
      <p className="text-lg leading-relaxed text-[var(--foreground)] flex-1 font-sans">
        {processedContent.map((part, index) => {
          if (part.type === 'text') {
            // ✅ Render plain text (already decoded)
            return <React.Fragment key={index}>{part.content}</React.Fragment>;
          } else if (part.type === 'latex') {
            // ✅ Render valid LaTeX (safe HTML output from KaTeX)
            return (
              <span
                key={index}
                className="text-[var(--foreground)]"
                dangerouslySetInnerHTML={{ __html: part.content }}
              />
            );
          } else if (part.type === 'error-latex') {
            // ⚠️ Render LaTeX errors in a visible styled block
            return (
              <span
                key={index}
                className="text-[var(--danger)] font-mono bg-[var(--danger)]/10 px-1 py-0.5 rounded"
                dangerouslySetInnerHTML={{ __html: part.rendered }}
              />
            );
          }
          return null; // Fallback safety
        })}
      </p>
    </div>


  );
};

export default QuestionDisplay;