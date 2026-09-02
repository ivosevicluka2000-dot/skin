import assert from "node:assert/strict";
import test from "node:test";
import {
  contentMinimums,
  dynamicPageContract,
  starterResiduePatterns,
  staticPageContract,
} from "./fixtures/mvp-contract.mjs";
import {
  assertDocumentBasics,
  closeBuiltRuntime,
  collectA11yProblems,
  collectInternalLinks,
  fetchFromWorker,
  loadBuiltWorker,
} from "./helpers/built-worker.mjs";

test.after(async () => {
  await closeBuiltRuntime();
});

let worker;
const rendered = new Map();

async function render(path) {
  if (rendered.has(path)) return rendered.get(path);
  worker ??= await loadBuiltWorker();
  const response = await fetchFromWorker(worker, path);
  const result = { response, html: await response.text() };
  rendered.set(path, result);
  return result;
}

for (const page of staticPageContract) {
  test(`server-renders ${page.name} (${page.path})`, async () => {
    const { response, html } = await render(page.path);
    assert.equal(response.status, 200, `${page.path}: expected HTTP 200`);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
      `${page.path}: expected an HTML response`,
    );
    for (const residue of starterResiduePatterns) {
      assert.doesNotMatch(html, residue, `${page.path}: starter UI leaked into MVP`);
    }
    assertDocumentBasics(html, page.path);
    assert.deepEqual(
      collectA11yProblems(html),
      [],
      `${page.path}: basic server-rendered accessibility checks failed`,
    );
  });
}

for (const dynamicPage of dynamicPageContract) {
  test(`discovers and renders ${dynamicPage.name}`, async () => {
    let discovered = [];

    for (const path of dynamicPage.discoveryPaths) {
      const { html } = await render(path);
      discovered.push(...collectInternalLinks(html, dynamicPage.linkPattern));
    }

    discovered = [...new Set(discovered)];
    assert.ok(
      discovered.length > 0,
      `Could not discover a ${dynamicPage.name} link from ${dynamicPage.discoveryPaths.join(", ")}`,
    );

    const samplePath = discovered[0];
    const { response, html } = await render(samplePath);
    assert.equal(response.status, 200, `${samplePath}: expected HTTP 200`);
    assertDocumentBasics(html, samplePath);
    assert.deepEqual(collectA11yProblems(html), []);
  });
}

test("catalog, editorial, and concern content is substantial enough to explore", async () => {
  const [{ html: shop }, { html: journal }, { html: home }] = await Promise.all([
    render("/shop"),
    render("/journal"),
    render("/"),
  ]);

  const products = collectInternalLinks(shop, /href=["'](\/product\/[^"'#?]+)["']/gi);
  const articles = collectInternalLinks(journal, /href=["'](\/journal\/[^"'#?]+)["']/gi);
  const concerns = collectInternalLinks(
    `${home}\n${shop}`,
    /href=["'](\/concerns\/[^"'#?]+)["']/gi,
  );

  assert.ok(products.length >= contentMinimums.productLinks, `Expected at least ${contentMinimums.productLinks} linked products; found ${products.length}`);
  assert.ok(articles.length >= contentMinimums.journalLinks, `Expected at least ${contentMinimums.journalLinks} linked articles; found ${articles.length}`);
  assert.ok(concerns.length >= contentMinimums.concernLinks, `Expected at least ${contentMinimums.concernLinks} linked concerns; found ${concerns.length}`);
});

test("unknown routes return a real not-found response", async () => {
  const { response, html } = await render("/__qa_missing_route__");
  assert.equal(response.status, 404);
  assert.doesNotMatch(html, /Internal Server Error/i);
});

test("health API has a machine-readable degraded mode without D1", async () => {
  worker ??= await loadBuiltWorker();
  const response = await fetchFromWorker(worker, "/api/health", {
    accept: "application/json",
  });

  assert.ok([200, 503].includes(response.status), `Unexpected health status ${response.status}`);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/i);
  const body = await response.json();
  assert.equal(typeof body, "object");
  assert.notEqual(body, null);
});

for (const path of ["/api/orders", "/api/routines", "/api/reviews", "/api/admin/overview", "/api/learning", "/api/community"]) {
  test(`${path} returns a machine-readable read response`, async () => {
    worker ??= await loadBuiltWorker();
    const response = await fetchFromWorker(worker, path, {
      accept: "application/json",
    });
    assert.ok(
      [200, 400, 401, 403, 503].includes(response.status),
      `${path}: unexpected status ${response.status}`,
    );
    assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/i);
    await response.json();
  });
}

for (const path of ["/api/newsletter", "/api/orders", "/api/routines", "/api/reviews", "/api/learning", "/api/community"]) {
  test(`${path} rejects an empty write without a server error`, async () => {
    worker ??= await loadBuiltWorker();
    const response = await fetchFromWorker(worker, path, {
      method: "POST",
      accept: "application/json",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    assert.ok(
      [400, 401, 403, 422, 503].includes(response.status),
      `${path}: invalid input returned unexpected status ${response.status}`,
    );
    assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/i);
    await response.json();
  });
}
