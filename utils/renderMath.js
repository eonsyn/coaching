// utils/renderMath.js
import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Parses text with inline LaTeX math expressions ($...$)
 * and returns an array of React nodes where math is rendered with InlineMath.
 * 
 * Example input: "Calculate the value of $\\frac{\\sqrt{11}-1}{2\\sqrt{3}}$."
 */
export function renderMathText(text) {
  if (!text) return null;

  // Split on $...$ inline math delimiters
  const parts = text.split(/(\$.*?\$)/g);

  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1); // remove $ delimiters
      return <InlineMath key={i}>{math}</InlineMath>;
    }
    return <span key={i}>{part}</span>;
  });
}
