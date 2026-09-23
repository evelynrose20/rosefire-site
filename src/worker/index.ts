import { Hono } from "hono";
import { defaultContent, type SiteContent } from "../react-app/siteContent";

type Bindings = {
  CONTENT: DurableObjectNamespace;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
};

type Variables = {
  admin: boolean;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const encoder = new TextEncoder();

function contentStub(env: Bindings) {
  const id = env.CONTENT.idFromName("rosefire-site");
  return env.CONTENT.get(id);
}

function parseCookies(header: string | undefined) {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) cookies[key] = decodeURIComponent(rest.join("="));
  }
  return cookies;
}

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function makeSession(secret: string) {
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = String(expires);
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

async function validSession(token: string | undefined, secret: string | undefined) {
  if (!token || !secret) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = await sign(expires, secret);
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

app.get("/api/content", async (c) => {
  const response = await contentStub(c.env).fetch("https://content.internal/content");
  if (response.status === 404) return c.json(defaultContent);
  return new Response(response.body, {
    status: response.status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
});

app.get("/api/admin/session", async (c) => {
  const token = parseCookies(c.req.header("cookie")).rosefire_admin;
  const authenticated = await validSession(token, c.env.SESSION_SECRET);
  return c.json({
    authenticated,
    configured: Boolean(c.env.ADMIN_PASSWORD && c.env.SESSION_SECRET),
  });
});

app.post("/api/admin/login", async (c) => {
  if (!c.env.ADMIN_PASSWORD || !c.env.SESSION_SECRET) {
    return c.json(
      { error: "Admin secrets are not configured in Cloudflare yet." },
      503,
    );
  }

  const body = await c.req.json<{ password?: string }>();
  if (!body.password || body.password !== c.env.ADMIN_PASSWORD) {
    return c.json({ error: "Incorrect password." }, 401);
  }

  const token = await makeSession(c.env.SESSION_SECRET);
  c.header(
    "Set-Cookie",
    `rosefire_admin=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
  );
  return c.json({ ok: true });
});

app.post("/api/admin/logout", (c) => {
  c.header(
    "Set-Cookie",
    "rosefire_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
  );
  return c.json({ ok: true });
});

app.put("/api/admin/content", async (c) => {
  const token = parseCookies(c.req.header("cookie")).rosefire_admin;
  const authenticated = await validSession(token, c.env.SESSION_SECRET);
  if (!authenticated) return c.json({ error: "Unauthorized." }, 401);

  const content = await c.req.json<SiteContent>();
  const response = await contentStub(c.env).fetch("https://content.internal/content", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(content),
  });
  return new Response(response.body, {
    status: response.status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
});

export class ContentStore {
  constructor(private state: DurableObjectState) {}

  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname !== "/content") return new Response("Not found", { status: 404 });

    if (request.method === "GET") {
      const content = await this.state.storage.get<SiteContent>("content");
      if (!content) return new Response("Not found", { status: 404 });
      return Response.json(content);
    }

    if (request.method === "PUT") {
      const content = await request.json<SiteContent>();
      await this.state.storage.put("content", content);
      return Response.json({ ok: true });
    }

    return new Response("Method not allowed", { status: 405 });
  }
}

export default app;
