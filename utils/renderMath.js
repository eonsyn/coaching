// utils/renderMath.js
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders text with both inline ($...$) and block ($$...$$ or \[...\]) LaTeX math using KaTeX.
 * Supports mixed content and handles malformed inputs gracefully.
 */
export function renderMathText(text) {
  if (!text) return null;

  // Regex to match: $$...$$, \[...\], or $...$
  const regex = /(\$\$(.+?)\$\$|\\\[(.+?)\\\]|(\$(?!\$)(.+?)(?<!\\)\$))/gs;

  const parts = [];
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Push text before match
    if (lastIndex < matchStart) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    if (match[2]) {
      // $$...$$ block
      parts.push(<BlockMath key={parts.length}>{match[2]}</BlockMath>);
    } else if (match[3]) {
      // \[...\] block
      parts.push(<BlockMath key={parts.length}>{match[3]}</BlockMath>);
    } else if (match[5]) {
      // $...$ inline
      parts.push(<InlineMath key={parts.length}>{match[5]}</InlineMath>);
    }

    lastIndex = matchEnd;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Render plain text parts as React Fragments
  return parts.map((part, index) =>
    typeof part === 'string' ? <React.Fragment key={index}>{part}</React.Fragment> : part
  );
}
