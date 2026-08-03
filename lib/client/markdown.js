/**
 * Lightweight Markdown → React-safe HTML renderer (no external deps).
 * Supports: ##/### headings, **bold**, *italic*, `code`, - lists, 1. lists, ---, blank-line paragraphs.
 *
 * Returns an array of React-key-indexed <JSX> strings safe to dangerouslySetInnerHTML.
 * Use the MarkdownBody component for rendering.
 */

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(text) {
  // Escape HTML first
  let out = escapeHtml(text);
  // Bold+italic ***text***
  out = out.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold **text**
  out = out.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic *text* or _text_ (not within words)
  out = out.replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, "<em>$1</em>");
  out = out.replace(/(?<!\w)_([^_\n]+)_(?!\w)/g, "<em>$1</em>");
  // Inline code `code`
  out = out.replace(/`([^`]+)`/g, '<code style="background:rgba(199,125,255,0.12);padding:0.1em 0.35em;border-radius:4px;font-size:0.88em;font-family:var(--font-mono,monospace)">$1</code>');
  return out;
}

/**
 * Convert a Markdown string to an HTML string.
 * @param {string} md
 * @returns {string} HTML
 */
export function markdownToHtml(md) {
  if (!md) return "";

  const lines = md.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // ─── Blank line → flush nothing, acts as block separator ───
    if (trimmed === "") {
      i++;
      continue;
    }

    // ─── Horizontal rule: ---, ***, ___ ───
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push('<hr style="border:none;border-top:1px solid rgba(199,125,255,0.2);margin:1.5rem 0" />');
      i++;
      continue;
    }

    // ─── Headings ───
    const h6 = trimmed.match(/^#{6}\s+(.*)/);
    const h5 = trimmed.match(/^#{5}\s+(.*)/);
    const h4 = trimmed.match(/^#{4}\s+(.*)/);
    const h3 = trimmed.match(/^#{3}\s+(.*)/);
    const h2 = trimmed.match(/^#{2}\s+(.*)/);
    const h1 = trimmed.match(/^#{1}\s+(.*)/);

    if (h6) { blocks.push(`<h6>${inlineFormat(h6[1])}</h6>`); i++; continue; }
    if (h5) { blocks.push(`<h5>${inlineFormat(h5[1])}</h5>`); i++; continue; }
    if (h4) { blocks.push(`<h4>${inlineFormat(h4[1])}</h4>`); i++; continue; }
    if (h3) { blocks.push(`<h3>${inlineFormat(h3[1])}</h3>`); i++; continue; }
    if (h2) { blocks.push(`<h2>${inlineFormat(h2[1])}</h2>`); i++; continue; }
    if (h1) { blocks.push(`<h1>${inlineFormat(h1[1])}</h1>`); i++; continue; }

    // ─── Unordered list ───
    if (/^[-*+]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        items.push(`<li>${inlineFormat(lines[i].trim().replace(/^[-*+]\s/, ""))}</li>`);
        i++;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // ─── Ordered list ───
    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(`<li>${inlineFormat(lines[i].trim().replace(/^\d+\.\s/, ""))}</li>`);
        i++;
      }
      blocks.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // ─── Paragraph: collect consecutive non-special lines ───
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i].trim()) &&
      !/^[-*+]\s/.test(lines[i].trim()) &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(inlineFormat(lines[i]));
      i++;
    }
    if (paraLines.length) {
      // Join with <br> to preserve single line breaks within a paragraph
      blocks.push(`<p>${paraLines.join("<br />")}</p>`);
    }
  }

  return blocks.join("\n");
}
