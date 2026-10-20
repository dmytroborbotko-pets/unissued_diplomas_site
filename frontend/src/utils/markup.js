// Plain-text markup for texts kept in the repo → Strapi "blocks" (rendered by shared/RichText).
// Blank line = new paragraph, **text** = highlighted (bold) run, [text](url) = link.
const INLINE = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

const inline = (text) => {
  const children = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) children.push({ type: "text", text: text.slice(last, m.index) });
    children.push(
      m[1] != null
        ? { type: "text", text: m[1], bold: true }
        : { type: "link", url: m[3], children: [{ type: "text", text: m[2] }] },
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) children.push({ type: "text", text: text.slice(last) });
  return children;
};

export const toBlocks = (text = "") =>
  text.split(/\n\s*\n/).map((p) => ({ type: "paragraph", children: inline(p) }));
