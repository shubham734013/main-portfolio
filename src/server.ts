import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { list, put } from "@vercel/blob";

const PORTFOLIO_BLOB_PATH = "portfolio-data.json";

let memoryPortfolioData: Record<string, unknown> = {};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

async function getPortfolioData(): Promise<Record<string, unknown>> {
  try {
    const { blobs } = await list({ prefix: PORTFOLIO_BLOB_PATH });
    const blob = blobs.find((item) => item.pathname === PORTFOLIO_BLOB_PATH);
    if (!blob) return memoryPortfolioData;
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return memoryPortfolioData;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return memoryPortfolioData;
  }
}

async function handlePortfolioApi(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/api/admin/auth" && request.method === "POST") {
    const body = (await request.json().catch(() => null)) as {
      password?: string;
    } | null;
    const expectedPassword =
      process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
    const valid = Boolean(expectedPassword && body?.password === expectedPassword);
    return jsonResponse({ authenticated: valid }, valid ? 200 : 401);
  }

  if (url.pathname !== "/api/portfolio") return jsonResponse({ error: "Not found" }, 404);

  if (request.method === "GET") {
    return jsonResponse(await getPortfolioData());
  }

  if (request.method === "POST") {
    const expectedPassword =
      process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
    const password = request.headers.get("x-admin-password");
    if (!expectedPassword || password !== expectedPassword) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "Invalid portfolio data" }, 400);
    }

    const storedData = await getPortfolioData();
    memoryPortfolioData = { ...storedData, ...body };
    try {
      await put(PORTFOLIO_BLOB_PATH, JSON.stringify(memoryPortfolioData), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    } catch (error) {
      console.error("Failed to save portfolio data to Vercel Blob:", error);
      return jsonResponse({ error: "Failed to save portfolio data" }, 500);
    }
    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}

type ServerEntry = {
  fetch: (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(
    consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`),
  );
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
    };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const { pathname } = new URL(request.url);
      if (pathname === "/api/portfolio" || pathname === "/api/admin/auth") {
        return await handlePortfolioApi(request);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
