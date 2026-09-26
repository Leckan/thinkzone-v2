import type { TextBlock } from "@/sanity/lib/content";

export function PortableContent({ blocks }: { blocks?: TextBlock[] }) {
  if (!blocks?.length) return null;
  return <div className="portable-content">{blocks.map((block, index) => {
    const text = block.children?.map((child) => child.text ?? "").join("").trim();
    if (!text) return null;
    const key = block._key ?? `${block._type}-${index}`;
    if (block.style === "h2") return <h2 key={key}>{text}</h2>;
    if (block.style === "h3") return <h3 key={key}>{text}</h3>;
    if (block.style === "blockquote") return <blockquote key={key}>{text}</blockquote>;
    return <p key={key}>{text}</p>;
  })}</div>;
}
