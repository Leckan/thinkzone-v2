import type { ReactNode } from "react";

type DocumentBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] };

function parseDocument(markdown: string): DocumentBlock[] {
  const lines = markdown.split("\n");
  const blocks: DocumentBlock[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 1 | 2 | 3, text: heading[2] });
      index += 1;
      continue;
    }

    const unorderedList = /^\s*-\s+/.test(lines[index]);
    const orderedList = /^\s*\d+\.\s+/.test(lines[index]);
    if (unorderedList || orderedList) {
      const items: string[] = [];
      const itemPattern = orderedList ? /^\s*\d+\.\s+/ : /^\s*-\s+/;
      while (index < lines.length && itemPattern.test(lines[index])) {
        items.push(lines[index].replace(itemPattern, "").trim());
        index += 1;
      }
      blocks.push({ type: orderedList ? "ordered-list" : "list", items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^\s*(?:#{1,3}\s+|-\s+|\d+\.\s+)/.test(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] | string {
  const tokens = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|(https?:\/\/[^\s),]+)/g;
  const content: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = tokens.exec(text)) !== null) {
    if (match.index > cursor) content.push(text.slice(cursor, match.index));

    const key = `${keyPrefix}-${tokenIndex}`;
    if (match[1] !== undefined) {
      content.push(<strong key={key}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      content.push(<a key={key} href={match[3]}>{match[2]}</a>);
    } else if (match[4] !== undefined) {
      content.push(<code key={key}>{match[4]}</code>);
    } else if (match[5] !== undefined) {
      const url = match[5].replace(/[.!?;:]+$/, "");
      const punctuation = match[5].slice(url.length);
      content.push(<a key={key} href={url}>{url}</a>, punctuation);
    }

    cursor = tokens.lastIndex;
    tokenIndex += 1;
  }

  if (cursor < text.length) content.push(text.slice(cursor));
  return content.length ? content : text;
}

function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function LegalDocumentContent({ markdown }: { markdown: string }) {
  const blocks = parseDocument(markdown);

  return (
    <div className="portable-content policy-body">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const id = headingId(block.text);
          if (block.level === 1) return <h1 key={id}>{block.text}</h1>;
          if (block.level === 2) return <h2 id={id} key={id}>{block.text}</h2>;
          return <h3 id={id} key={id}>{block.text}</h3>;
        }

        if (block.type === "list" || block.type === "ordered-list") {
          const items = block.items.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{renderInline(item, `${index}-${itemIndex}`)}</li>);
          return block.type === "ordered-list" ? <ol key={`list-${index}`}>{items}</ol> : <ul key={`list-${index}`}>{items}</ul>;
        }

        return <p key={`paragraph-${index}`}>{renderInline(block.text, `paragraph-${index}`)}</p>;
      })}
    </div>
  );
}
