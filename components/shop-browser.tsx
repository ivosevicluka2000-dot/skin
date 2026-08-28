"use client";

import { useMemo, useState } from "react";
import type { Concern, Product, ProductCategory } from "@/lib/data/types";
import { categoryLabels } from "@/lib/ui";
import { ProductCard } from "./product-card";

type Filter = "sve" | ProductCategory | Concern["id"];

export function ShopBrowser({ products, concerns }: { products: readonly Product[]; concerns: readonly Concern[] }) {
  const [filter, setFilter] = useState<Filter>("sve");
  const filtered = useMemo(() => products.filter((product) => {
    if (filter === "sve") return true;
    return product.category === filter || product.concernIds.includes(filter as Concern["id"]);
  }), [filter, products]);

  const popularCategories: ProductCategory[] = ["serumi", "kreme", "spf", "cistaci"];

  return (
    <>
      <div className="filter-bar" aria-label="Filteri proizvoda">
        <button className={`filter-chip ${filter === "sve" ? "is-active" : ""}`} onClick={() => setFilter("sve")}>Sve</button>
        {popularCategories.map((category) => <button key={category} className={`filter-chip ${filter === category ? "is-active" : ""}`} onClick={() => setFilter(category)}>{categoryLabels[category]}</button>)}
        {concerns.slice(0, 4).map((concern) => <button key={concern.id} className={`filter-chip ${filter === concern.id ? "is-active" : ""}`} onClick={() => setFilter(concern.id)}>{concern.name}</button>)}
      </div>
      <section className="catalog-wrap">
        <div className="catalog-meta"><span>{filtered.length} pažljivo odabrana proizvoda</span><span>Sortirano: EQUA izbor</span></div>
        {filtered.length ? <div className="catalog-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>Nema rezultata za ovaj filter.</h2><button className="button button--dark" onClick={() => setFilter("sve")}>Prikaži sve</button></div>}
      </section>
    </>
  );
}
