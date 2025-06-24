// utils/renderMath.js
import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders text with inline LaTeX math expressions ($...$) using KaTeX.
 * Safely handles cases where $ is unmatched or used incorrectly.
 * 
 * Example: "Find the value of $\\frac{a+b}{c}$ when $a = 2$ and $b = 3$."
 */
export function renderMathText(text) {
  if (!text) return null;

  // Regex to match anything between $...$, non-greedy
  const parts = text.split(/(\$(?:\\\$|[^$])+\$)/g); 

  return parts.map((part, index) => {
    // Match $...$
    const match = /^\$(.*)\$$/.exec(part);
    if (match) {
      return <InlineMath key={index}>{match[1]}</InlineMath>;
    } else {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }
  });
}
