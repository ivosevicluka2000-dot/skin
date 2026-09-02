import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { starterResiduePatterns } from "./fixtures/mvp-contract.mjs";

const root = new URL("../", import.meta.url);

const requiredPages = [
  "app/page.tsx",
  "app/shop/page.tsx",
  "app/product/[slug]/page.tsx",
  "app/journal/page.tsx",
  "app/journal/[slug]/page.tsx",
  "app/ingredients/page.tsx",
  "app/concerns/[slug]/page.tsx",
  "app/quiz/page.tsx",
  "app/routine/page.tsx",
  "app/cart/page.tsx",
  "app/account/page.tsx",
  "app/admin/page.tsx",
  "app/academy/page.tsx",
  "app/academy/programs/page.tsx",
  "app/academy/[slug]/page.tsx",
  "app/academy/[slug]/[lesson]/page.tsx",
  "app/community/page.tsx",
  "app/api/health/route.ts",
  "app/api/admin/overview/route.ts",
  "app/api/newsletter/route.ts",
  "app/api/orders/route.ts",
  "app/api/routines/route.ts",
  "app/api/reviews/route.ts",
  "app/api/learning/route.ts",
  "app/api/community/route.ts",
];

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("implements the agreed MVP route surface", async () => {
  const missing = [];
  for (const path of requiredPages) {
    try {
      await access(new URL(path, root));
    } catch {
      missing.push(path);
    }
  }
  assert.deepEqual(missing, [], `Missing route files:\n${missing.join("\n")}`);
});

test("removes the disposable starter preview", async () => {
  try {
    const residue = await readdir(new URL("app/_sites-preview", root));
    assert.deepEqual(residue, [], "Starter preview directory still contains files");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const [page, layout] = await Promise.all([
    read("app/page.tsx"),
    read("app/layout.tsx"),
  ]);
  for (const pattern of starterResiduePatterns) {
    assert.doesNotMatch(`${page}\n${layout}`, pattern);
  }
  assert.doesNotMatch(layout, /title:\s*["']Starter Project["']/i);
  assert.match(layout, /<html\b[^>]*\blang=["']sr(?:-[^"']+)?["']/i);
});

test("ships keyboard focus and reduced-motion fallbacks", async () => {
  const css = await read("app/globals.css");
  assert.match(css, /:focus-visible/i, "Missing visible keyboard focus treatment");
  assert.match(css, /prefers-reduced-motion\s*:\s*reduce/i, "Missing reduced-motion fallback");
  assert.match(css, /\.mobile-menu__nav\s*\{/i, "Mobile navigation is present in markup but has no component styling");
});

test("ships mobile navigation reset, visual ingredient cards, and a two-column footer", async () => {
  const [shell, ingredients, css] = await Promise.all([
    read("components/site-shell.tsx"),
    read("app/ingredients/page.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(shell, /scrollRestoration\s*=\s*["']manual["']/);
  assert.match(shell, /window\.scrollTo\(0,\s*0\)/);
  assert.match(ingredients, /ingredient\.image/);
  assert.match(ingredients, /ingredient-card__visual/);
  assert.match(css, /@media\s*\(max-width:480px\)[\s\S]*?\.site-footer__grid\s*\{\s*grid-template-columns:repeat\(2/i);
});

test("ships the complete hi-fi commerce path", async () => {
  const [checkout, admin, product] = await Promise.all([
    read("app/cart/page.tsx"),
    read("app/admin/page.tsx"),
    read("app/product/[slug]/page.tsx"),
  ]);
  assert.match(checkout, /checkout-steps/);
  assert.match(checkout, /cash_on_delivery/);
  assert.match(checkout, /demo_card/);
  assert.match(checkout, /POST|fetch\(["']\/api\/orders/);
  assert.match(admin, /Interaktivni mockup/);
  assert.match(admin, /ERP & CRM/);
  assert.match(admin, /Integration hub/);
  assert.match(admin, /OrderTable/);
  assert.match(product, /ReviewPanel/);
});

test("ships the connected learning-commerce path", async () => {
  const [home, academy, programLibrary, course, lesson, account, community, learningApi, memberGate, memberApi] = await Promise.all([
    read("components/home-experience.tsx"),
    read("components/academy-experience.tsx"),
    read("components/program-library.tsx"),
    read("app/academy/[slug]/page.tsx"),
    read("components/lesson-experience.tsx"),
    read("app/account/page.tsx"),
    read("components/community-experience.tsx"),
    read("app/api/learning/route.ts"),
    read("components/member-gate.tsx"),
    read("app/api/member/route.ts"),
  ]);
  assert.match(home, /EQUA Akademija/);
  assert.match(academy, /courseLessonCount/);
  assert.match(academy, /academy-hub/);
  assert.match(programLibrary, /Pretraži programe/);
  assert.match(programLibrary, /Svi nivoi/);
  assert.match(course, /Curriculum|curriculum/i);
  assert.match(lesson, /Dodaj celu rutinu/);
  assert.match(lesson, /completeLesson/);
  assert.match(account, /Moja Akademija/);
  assert.match(community, /Nova tema/);
  assert.match(learningApi, /lesson_progress/);
  assert.match(learningApi, /quiz_results/);
  assert.match(memberGate, /Samo za članove/);
  assert.match(memberGate, /\/join\?returnTo=/);
  assert.match(memberApi, /getChatGPTUser/);
});

test("does not leave placeholder anchors in route source", async () => {
  const app = new URL("app/", root);
  const files = [];

  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.name === "_sites-preview") continue;
      const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
      if (entry.isDirectory()) await walk(url);
      else if (/\.(?:tsx|ts)$/.test(entry.name)) files.push(url);
    }
  }

  await walk(app);
  const offenders = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (/href\s*=\s*["']#["']/.test(source)) {
      offenders.push(decodeURIComponent(file.pathname.replace(root.pathname, "")));
    }
  }
  assert.deepEqual(offenders, [], `Placeholder href="#" found in:\n${offenders.join("\n")}`);
});

test("declares the D1 binding required by the mini backend", async () => {
  const hosting = JSON.parse(await read(".openai/hosting.json"));
  assert.equal(hosting.d1, "DB");
});

test("initial migration includes the complete durable MVP model", async () => {
  const migration = await read("db/migrations/0000_initial_mvp.sql");
  assert.match(migration, /PRAGMA\s+foreign_keys\s*=\s*ON/i);

  for (const table of [
    "newsletter_signups",
    "orders",
    "order_items",
    "saved_routines",
    "reviews",
    "event_log",
  ]) {
    assert.match(
      migration,
      new RegExp(`CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${table}\\b`, "i"),
      `Migration is missing ${table}`,
    );
  }

  assert.match(migration, /REFERENCES\s+orders\s*\(id\)\s+ON\s+DELETE\s+CASCADE/i);
  assert.match(migration, /CHECK\s*\(rating\s+BETWEEN\s+1\s+AND\s+5\)/i);
  assert.match(migration, /UNIQUE\s+INDEX[\s\S]*newsletter_signups\s*\(email\)/i);
});

test("learning and community runtime schema is durable", async () => {
  const runtime = await read("db/runtime-schema.ts");
  for (const table of ["course_enrollments", "lesson_progress", "quiz_results", "community_posts", "community_comments"]) {
    assert.match(runtime, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, "i"), `Runtime schema is missing ${table}`);
  }
  assert.match(runtime, /UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_owner_lesson/i);
  assert.match(runtime, /REFERENCES community_posts\(id\) ON DELETE CASCADE/i);
});
