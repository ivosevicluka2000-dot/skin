import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const root = new URL("../", import.meta.url);

function assertUnique(items, label) {
  const duplicates = items.filter((value, index) => items.indexOf(value) !== index);
  assert.deepEqual([...new Set(duplicates)], [], `Duplicate ${label}: ${duplicates.join(", ")}`);
}

function assertReferences(values, valid, label) {
  const missing = values.filter((value) => !valid.has(value));
  assert.deepEqual([...new Set(missing)], [], `Broken ${label}: ${missing.join(", ")}`);
}

async function loadDataset() {
  const server = await createServer({
    root: decodeURIComponent(root.pathname),
    configFile: false,
    logLevel: "silent",
    appType: "custom",
    server: { middlewareMode: true },
  });

  try {
    return await server.ssrLoadModule("/lib/data/index.ts");
  } finally {
    await server.close();
  }
}

test("seed catalog is substantial, unique, and internally connected", async () => {
  const data = await loadDataset();
  const {
    articles,
    brands,
    concerns,
    ingredients,
    products,
    quizQuestions,
    routines,
  } = data;

  assert.ok(products.length >= 24, `Expected at least 24 products; found ${products.length}`);
  assert.ok(brands.length >= 6, `Expected at least 6 brands; found ${brands.length}`);
  assert.ok(concerns.length >= 8, `Expected at least 8 concerns; found ${concerns.length}`);
  assert.ok(ingredients.length >= 12, `Expected at least 12 ingredients; found ${ingredients.length}`);
  assert.ok(articles.length >= 8, `Expected at least 8 articles; found ${articles.length}`);
  assert.ok(routines.length >= 6, `Expected at least 6 routines; found ${routines.length}`);
  assert.ok(quizQuestions.length >= 7, `Expected at least 7 quiz questions; found ${quizQuestions.length}`);

  for (const [label, records] of Object.entries({
    brand: brands,
    concern: concerns,
    ingredient: ingredients,
    product: products,
    article: articles,
    routine: routines,
    "quiz question": quizQuestions,
  })) {
    assertUnique(records.map((record) => record.id), `${label} IDs`);
  }
  assertUnique(products.map((product) => product.slug), "product slugs");
  assertUnique(products.map((product) => product.sku), "product SKUs");
  assertUnique(concerns.map((concern) => concern.slug), "concern slugs");
  assertUnique(ingredients.map((ingredient) => ingredient.slug), "ingredient slugs");
  assertUnique(articles.map((article) => article.slug), "article slugs");

  const brandIds = new Set(brands.map((brand) => brand.id));
  const concernIds = new Set(concerns.map((concern) => concern.id));
  const ingredientIds = new Set(ingredients.map((ingredient) => ingredient.id));
  const productIds = new Set(products.map((product) => product.id));
  const routineIds = new Set(routines.map((routine) => routine.id));

  for (const product of products) {
    assert.ok(product.name.trim().length >= 3, `${product.id}: missing product name`);
    assert.ok(Number.isInteger(product.priceRsd) && product.priceRsd > 0, `${product.id}: invalid price`);
    assert.ok(Number.isInteger(product.stock.quantity) && product.stock.quantity >= 0, `${product.id}: invalid stock`);
    assert.ok(product.rating.average >= 1 && product.rating.average <= 5, `${product.id}: invalid rating`);
    if (product.compareAtPriceRsd !== undefined) {
      assert.ok(product.compareAtPriceRsd > product.priceRsd, `${product.id}: compare-at price must exceed sale price`);
    }
    if (product.stock.status === "nema-na-stanju") {
      assert.equal(product.stock.quantity, 0, `${product.id}: out-of-stock product has inventory`);
    }
    assertReferences([product.brandId], brandIds, `${product.id} brand`);
    assertReferences(product.concernIds, concernIds, `${product.id} concerns`);
    assertReferences(product.ingredientIds, ingredientIds, `${product.id} ingredients`);
    assert.match(product.image, /^(?:\/|https:\/\/)/, `${product.id}: invalid image URL`);
  }

  for (const concern of concerns) {
    assertReferences(concern.recommendedIngredientIds, ingredientIds, `${concern.id} recommended ingredients`);
  }

  for (const ingredient of ingredients) {
    assertReferences(ingredient.bestForConcernIds, concernIds, `${ingredient.id} concerns`);
    assertReferences(ingredient.pairings.map((pairing) => pairing.ingredientId), ingredientIds, `${ingredient.id} pairings`);
  }

  for (const article of articles) {
    assertReferences(article.relatedProductIds, productIds, `${article.id} products`);
    assertReferences(article.concernIds, concernIds, `${article.id} concerns`);
    assertReferences(article.ingredientIds, ingredientIds, `${article.id} ingredients`);
    assert.ok(article.sections.length > 0, `${article.id}: article has no sections`);
    assert.ok(article.readingMinutes > 0, `${article.id}: invalid reading time`);
    assert.ok(Number.isFinite(Date.parse(article.publishedAt)), `${article.id}: invalid publication date`);
  }

  for (const routine of routines) {
    assertReferences(routine.primaryConcernIds, concernIds, `${routine.id} concerns`);
    for (const [period, items] of [["morning", routine.morning], ["evening", routine.evening]]) {
      assert.ok(items.length > 0, `${routine.id}: empty ${period} routine`);
      assertReferences(items.map((item) => item.productId), productIds, `${routine.id} ${period} products`);
      assert.deepEqual(
        items.map((item) => item.order),
        items.map((_, index) => index + 1),
        `${routine.id}: ${period} steps are not sequential`,
      );
    }
    const morningProducts = routine.morning.map((item) => products.find((product) => product.id === item.productId));
    assert.ok(morningProducts.some((product) => product?.routineStep === "spf"), `${routine.id}: morning routine has no SPF`);
  }

  const answerIds = quizQuestions.flatMap((question) => question.answers.map((answer) => answer.id));
  assertUnique(answerIds, "quiz answer IDs");
  for (const question of quizQuestions) {
    assert.equal(question.required, true, `${question.id}: MVP questions should be required`);
    assert.ok(question.answers.length >= 2, `${question.id}: too few answers`);
    for (const answer of question.answers) {
      assertReferences(Object.keys(answer.scores), routineIds, `${answer.id} score targets`);
      assert.ok(Object.values(answer.scores).every((score) => Number.isFinite(score) && score >= 0), `${answer.id}: invalid score`);
    }
  }
});

test("recommendation engine is deterministic and applies its safety exclusion", async () => {
  const { recommendRoutine, formatRsd } = await loadDataset();
  const breakout = recommendRoutine(["goal-breakouts", "goal-breakouts"]);
  assert.equal(breakout.routineId, "cista-koza");
  assert.deepEqual(breakout.answerIds, ["goal-breakouts"]);

  const pregnancy = recommendRoutine(["goal-lines", "pregnancy-yes", "spf-never"]);
  assert.ok(pregnancy.excludedProductIds.includes("al-retinal-emulsion"));
  assert.ok(pregnancy.safetyMessages.length >= 2);
  assert.match(formatRsd(2890), /RSD$/);
});
