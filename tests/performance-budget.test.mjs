import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const clientAssets = new URL("dist/client/assets/", root);
const publicRoot = new URL("public/", root);

async function exists(url) {
  try {
    await access(url);
    return true;
  } catch {
    return false;
  }
}

async function filesBelow(directory) {
  if (!(await exists(directory))) return [];
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) files.push(...(await filesBelow(url)));
    else files.push(url);
  }
  return files;
}

test("keeps individual browser bundles within a practical MVP budget", async (t) => {
  if (!(await exists(clientAssets))) {
    t.skip("Run the vinext production build before checking bundle budgets");
    return;
  }

  const assets = await filesBelow(clientAssets);
  const overBudget = [];
  for (const url of assets.filter((file) => /\.(?:js|css)$/.test(file.pathname))) {
    const source = await readFile(url);
    const compressedBytes = gzipSync(source).byteLength;
    const limit = url.pathname.endsWith(".css") ? 110_000 : 350_000;
    if (compressedBytes > limit) {
      overBudget.push(`${decodeURIComponent(url.pathname.split("/").at(-1))}: ${Math.ceil(compressedBytes / 1024)} KiB gzip`);
    }
  }

  assert.deepEqual(overBudget, [], `Oversized client assets:\n${overBudget.join("\n")}`);
});

test("keeps checked-in media assets suitable for web delivery", async () => {
  const assets = await filesBelow(publicRoot);
  const overBudget = [];

  for (const url of assets) {
    const extension = url.pathname.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
    const limit = ["mp4", "webm"].includes(extension) ? 8_000_000 : 2_000_000;
    if (!["avif", "gif", "jpeg", "jpg", "png", "svg", "webp", "mp4", "webm"].includes(extension)) continue;
    const bytes = (await stat(url)).size;
    if (bytes > limit) {
      overBudget.push(`${decodeURIComponent(url.pathname.replace(publicRoot.pathname, ""))}: ${Math.ceil(bytes / 1024)} KiB`);
    }
  }

  assert.deepEqual(overBudget, [], `Oversized public media:\n${overBudget.join("\n")}`);
});
