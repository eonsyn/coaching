export function sanitizeMathText(text) {
  if (!text) return '';

  // Fix broken $...$ LaTeX blocks by joining across newline
  const fixed = text.replace(/\$\|[\s\n]*\$/g, '|') // Fix $|\n$ → |
                 .replace(/\$(.*?)\$/gs, (match, inner) => {
                   const cleaned = inner.replace(/\n/g, ' ');
                   return `$${cleaned}$`;
                 });

  return fixed;
}
