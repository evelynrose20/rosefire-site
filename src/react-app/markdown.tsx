import type { ReactNode } from "react";

export type MarkdownDocument = {
  meta: Record<string, string>;
  body: string;
};

export function parseDocument(source: string): MarkdownDocument {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { meta: {}, body: normalized };

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) return { meta: {}, body: normalized };

  const meta: Record<string, string> = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const split = line.indexOf(":");
    if (split === -1) continue;
    const key = line.slice(0, split).trim();
    let value = line.slice(split + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) meta[key] = value;
  }

  return { meta, body: normalized.slice(end + 5).trim() };
}

function inline(text: string, renderLink?: (href: string, children: ReactNode) => ReactNode): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);
  return parts.filter(Boolean).map((part, index) => {
    const strongLink = part.match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/);
    if (strongLink) {
      const linked = renderLink ? renderLink(strongLink[2], strongLink[1]) : <a href={strongLink[2]}>{strongLink[1]}</a>;
      return <strong key={index}>{linked}</strong>;
    }
    const strong = part.match(/^\*\*(.+)\*\*$/);
    if (strong) return <strong key={index}>{strong[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return renderLink ? <span key={index}>{renderLink(link[2], link[1])}</span> : <a key={index} href={link[2]}>{link[1]}</a>;
    const code = part.match(/^`(.+)`$/);
    if (code) return <code key={index}>{code[1]}</code>;
    return part;
  });
}

export function Markdown({ source, renderLink }: { source: string; renderLink?: (href: string, children: ReactNode) => ReactNode }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const output: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let ordered = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(<p key={`p-${output.length}`}>{inline(paragraph.join(" "), renderLink)}</p>);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    const Tag = ordered ? "ol" : "ul";
    output.push(<Tag key={`l-${output.length}`}>{list.map((item, i) => <li key={i}>{inline(item, renderLink)}</li>)}</Tag>);
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      if (level === 1) output.push(<h1 key={`h-${output.length}`}>{inline(heading[2], renderLink)}</h1>);
      else if (level === 2) output.push(<h2 key={`h-${output.length}`}>{inline(heading[2], renderLink)}</h2>);
      else if (level === 3) output.push(<h3 key={`h-${output.length}`}>{inline(heading[2], renderLink)}</h3>);
      else output.push(<h4 key={`h-${output.length}`}>{inline(heading[2], renderLink)}</h4>);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      flushList();
      output.push(<blockquote key={`q-${output.length}`}>{inline(quote[1], renderLink)}</blockquote>);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      output.push(<hr key={`hr-${output.length}`} />);
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || numbered) {
      flushParagraph();
      const nextOrdered = Boolean(numbered);
      if (list.length && ordered !== nextOrdered) flushList();
      ordered = nextOrdered;
      list.push((unordered ?? numbered)![1]);
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  return <>{output}</>;
}
