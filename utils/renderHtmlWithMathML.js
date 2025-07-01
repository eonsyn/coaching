export function renderHtmlWithMathML(content) {
  return content
    .replace(/\n/g, '<br/>')
    .replace(/\u00a0/g, ' ') // Non-breaking space
    .replace(/\u003C/g, '<')
    .replace(/\u003E/g, '>')
    .replace(/\u0026/g, '&')
    .replace(/&nbsp;/g, ' ');
}
