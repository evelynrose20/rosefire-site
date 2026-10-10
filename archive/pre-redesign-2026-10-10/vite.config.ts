import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type ContentEntry = {
  route: string;
  file: string;
  title: string;
  nav: boolean;
  navOrder: number;
};

function readMeta(source: string): Record<string, string> {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return {};
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) return {};

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
  return meta;
}

function slugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function routeFor(file: string): string {
  const parts = file.split("/");
  const filename = parts.pop() ?? "";
  const stem = filename.replace(/\.md$/i, "");

  if (parts.length === 0 && stem.toLowerCase() === "home") return "/";
  if (stem.toLowerCase() !== "index") parts.push(stem);

  const slug = parts.map(slugPart).filter(Boolean).join("/");
  return slug ? `/${slug}` : "/";
}

function scanContent(): ContentEntry[] {
  const root = join(process.cwd(), "public", "content");
  const files: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        files.push(relative(root, full).split(sep).join("/"));
      }
    }
  };

  walk(root);

  return files.map(file => {
    const source = readFileSync(join(root, file), "utf8");
    const meta = readMeta(source);
    const filename = file.split("/").pop() ?? file;
    const fallbackTitle = filename.replace(/\.md$/i, "").replace(/[-_]+/g, " ");
    const navOrder = Number(meta.navOrder ?? "999");

    return {
      route: routeFor(file),
      file,
      title: meta.navTitle || meta.title || fallbackTitle,
      nav: meta.nav === "true",
      navOrder: Number.isFinite(navOrder) ? navOrder : 999,
    };
  }).sort((a, b) => a.route.localeCompare(b.route));
}

function contentIndexPlugin(): Plugin {
  return {
    name: "rosefire-content-index",
    configureServer(server) {
      server.middlewares.use("/content-index.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify(scanContent(), null, 2));
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "content-index.json",
        source: JSON.stringify(scanContent(), null, 2),
      });
    },
  };
}

export default defineConfig({
  base: process.env.PAGES_BASE ?? "/",
  plugins: [react(), contentIndexPlugin()],
});
