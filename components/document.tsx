import Link from "next/link";
import type { ContentBlock, PublicDocument } from "@/lib/content";
import { markdownPath } from "@/lib/content";

export function Content({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "paragraph": return <p key={index}>{block.text}</p>;
      case "heading": return <h2 key={index}>{block.text}</h2>;
      case "list": return <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
      case "steps": return <ol key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ol>;
      case "links": return <div className="related-links" key={index}>{block.links.map((link) => <Link key={link.href} href={link.href}><strong>{link.label}</strong><span>{link.description}</span></Link>)}</div>;
      default: { const exhaustive: never = block; return exhaustive; }
    }
  });
}

export function DocumentPage({ document }: { document: PublicDocument }) {
  return <main id="main" className="article wrap">
    <div className="article-heading"><Link className="back-link" href={document.category === "guide" && document.path !== "/guides" ? "/guides" : "/"}>{document.category === "guide" && document.path !== "/guides" ? "All guides" : "Kopy home"}</Link><h1>{document.title}</h1><p className="article-description">{document.description}</p><div className="article-meta"><span>Updated November 21, 2026</span><a href={markdownPath(document.path)}>Read as Markdown</a></div></div>
    <div className="prose"><Content blocks={document.blocks} /></div>
  </main>;
}
