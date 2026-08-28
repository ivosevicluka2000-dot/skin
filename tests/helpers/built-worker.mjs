import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";

const projectRoot = new URL("../../", import.meta.url);
const workerEntry = new URL("../../dist/server/index.js", import.meta.url);

export async function hasBuiltWorker() {
  try {
    await access(workerEntry);
    return true;
  } catch {
    return false;
  }
}

export async function loadBuiltWorker() {
  assert.equal(
    await hasBuiltWorker(),
    true,
    "Missing dist/server/index.js. Run `npm run build` before browser-free smoke tests.",
  );

  return getLocalRuntime();
}

export function createWorkerEnv(overrides = {}) {
  return {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
    ...overrides,
  };
}

export function createExecutionContext() {
  return {
    waitUntil() {},
    passThroughOnException() {},
    props: {},
  };
}

export async function fetchFromWorker(worker, path, options = {}) {
  const url = new URL(path, worker.baseUrl);
  const headers = new Headers(options.headers);
  headers.set("accept", options.accept ?? "text/html");
  const { accept, env, ...requestOptions } = options;
  void accept;
  void env;
  return fetch(new Request(url, { ...requestOptions, headers }));
}

export function collectInternalLinks(html, pattern) {
  const links = new Set();
  pattern.lastIndex = 0;
  for (const match of html.matchAll(pattern)) {
    links.add(match[1]);
  }
  return [...links];
}

export function stripMarkup(value) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function assertDocumentBasics(html, path) {
  assert.match(html, /<!doctype html>/i, `${path}: missing HTML doctype`);
  assert.match(
    html,
    /<html\b[^>]*\blang=["']sr(?:-[^"']+)?["']/i,
    `${path}: document language should be Serbian`,
  );
  assert.match(html, /<title>[^<]{2,}<\/title>/i, `${path}: missing title`);
  assert.match(
    html,
    /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']{20,}["'])[^>]*>/i,
    `${path}: missing meaningful meta description`,
  );
  assert.match(html, /<main\b/i, `${path}: missing main landmark`);
  assert.match(html, /<h1\b/i, `${path}: missing h1`);

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  assert.equal(h1Count, 1, `${path}: expected exactly one h1, found ${h1Count}`);
  const mainCount = (html.match(/<main\b/gi) ?? []).length;
  assert.equal(mainCount, 1, `${path}: expected exactly one main landmark, found ${mainCount}`);
}

export function collectA11yProblems(html) {
  const problems = [];
  const ids = new Set();

  for (const tag of html.matchAll(/<[^>]+\bid=["']([^"']+)["'][^>]*>/gi)) {
    if (ids.has(tag[1])) problems.push(`duplicate id: ${tag[1]}`);
    ids.add(tag[1]);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(match[0])) {
      problems.push(`image without alt: ${match[0].slice(0, 100)}`);
    }
  }

  for (const match of html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/gi)) {
    const tag = match[0].match(/^<button\b[^>]*>/i)?.[0] ?? "";
    const accessibleText = stripMarkup(match[0].replace(tag, "").replace(/<\/button>$/i, ""));
    if (!accessibleText && !/\baria-label=["'][^"']+["']/i.test(tag)) {
      problems.push(`unlabelled button: ${tag.slice(0, 100)}`);
    }
  }

  for (const match of html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)) {
    const tag = match[0].match(/^<a\b[^>]*>/i)?.[0] ?? "";
    const accessibleText = stripMarkup(match[0].replace(tag, "").replace(/<\/a>$/i, ""));
    const namedImage = /<img\b[^>]*\balt=["'][^"']+["'][^>]*>/i.test(match[0]);
    if (!accessibleText && !namedImage && !/\baria-label=["'][^"']+["']/i.test(tag)) {
      problems.push(`unlabelled link: ${tag.slice(0, 100)}`);
    }
    const href = tag.match(/\bhref=["']([^"']*)["']/i)?.[1];
    if (href === "" || href === "#") problems.push(`non-functional link: ${tag.slice(0, 100)}`);
    if (href?.startsWith("#") && href.length > 1 && !ids.has(decodeURIComponent(href.slice(1)))) {
      problems.push(`fragment link has no target (${href}): ${tag.slice(0, 100)}`);
    }
  }

  const labelTargets = new Set(
    [...html.matchAll(/<label\b[^>]*\bfor=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]),
  );
  for (const match of html.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)) {
    const tag = match[0];
    if (/<input\b/i.test(tag) && /\btype=["'](?:hidden|submit|button|reset|image)["']/i.test(tag)) continue;
    const id = tag.match(/\bid=["']([^"']+)["']/i)?.[1];
    const position = match.index ?? 0;
    const insideLabel = html.lastIndexOf("<label", position) > html.lastIndexOf("</label", position);
    const isNamed =
      insideLabel ||
      (id && labelTargets.has(id)) ||
      /\baria-label=["'][^"']+["']/i.test(tag) ||
      /\baria-labelledby=["'][^"']+["']/i.test(tag);
    if (!isNamed) problems.push(`form control without a label: ${tag.slice(0, 100)}`);
  }

  return problems;
}

export { projectRoot };

let runtimePromise;
let ownedRuntimeProcess;

async function readExistingRuntimeUrl() {
  try {
    const lock = JSON.parse(await readFile(new URL("../../.vinext/dev/lock.json", import.meta.url), "utf8"));
    const url = new URL(lock.appUrl);
    url.hostname = "localhost";
    const response = await fetch(new URL("/api/health", url), {
      signal: AbortSignal.timeout(2_000),
    });
    if (response.status < 600) return url.href;
  } catch {
    // No healthy retained preview; the test suite starts a temporary one below.
  }
  return null;
}

async function waitForRuntime(child) {
  let output = "";
  child.stdout?.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr?.on("data", (chunk) => {
    output += chunk.toString();
  });

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const printedUrl = output.match(/(?:Local:|running at)\s+(https?:\/\/[^\s]+)/i)?.[1];
    const lockedUrl = await readExistingRuntimeUrl();
    const candidate = lockedUrl ?? printedUrl;
    if (candidate) {
      const url = new URL(candidate);
      url.hostname = "localhost";
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
        if (response.status < 600) return url.href;
      } catch {
        // Runtime is still warming up.
      }
    }

    if (child.exitCode !== null) {
      throw new Error(`Temporary vinext runtime exited early (${child.exitCode}).\n${output}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for the temporary vinext runtime.\n${output}`);
}

async function getLocalRuntime() {
  runtimePromise ??= (async () => {
    const existing = await readExistingRuntimeUrl();
    if (existing) return { baseUrl: existing, owned: false };

    const child = spawn("npm", ["run", "dev", "--", "--port", "0"], {
      cwd: decodeURIComponent(projectRoot.pathname),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      detached: process.platform !== "win32",
    });
    ownedRuntimeProcess = child;
    const baseUrl = await waitForRuntime(child);
    return { baseUrl, owned: true };
  })();
  return runtimePromise;
}

export async function closeBuiltRuntime() {
  if (!ownedRuntimeProcess || ownedRuntimeProcess.exitCode !== null) return;
  if (process.platform === "win32") ownedRuntimeProcess.kill("SIGTERM");
  else process.kill(-ownedRuntimeProcess.pid, "SIGTERM");
  await Promise.race([
    new Promise((resolve) => ownedRuntimeProcess.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
  ownedRuntimeProcess = undefined;
  runtimePromise = undefined;
}
