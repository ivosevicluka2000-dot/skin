"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Concern, Product, ProductCategory } from "@/lib/data/types";
import { categoryLabels } from "@/lib/ui";
import { ProductCard } from "./product-card";

type Filter = "sve" | ProductCategory | Concern["id"];

export function ShopBrowser({ products, concerns }: { products: readonly Product[]; concerns: readonly Concern[] }) {
  const [filter, setFilter] = useState<Filter>("sve");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("equa");
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("sr-Latn");
    const matches = products.filter((product) => {
      const filterMatch = filter === "sve" || product.category === filter || product.concernIds.includes(filter as Concern["id"]);
      const queryMatch = !normalizedQuery || `${product.name} ${product.shortDescription}`.toLocaleLowerCase("sr-Latn").includes(normalizedQuery);
      return filterMatch && queryMatch;
    });
    return [...matches].sort((a, b) => {
      if (sort === "price-low") return a.priceRsd - b.priceRsd;
      if (sort === "price-high") return b.priceRsd - a.priceRsd;
      if (sort === "rating") return b.rating.average - a.rating.average;
      return Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller);
    });
  }, [filter, products, query, sort]);

  const popularCategories: ProductCategory[] = ["serumi", "kreme", "spf", "cistaci"];

  return (
    <>
      <div className="filter-bar" aria-label="Filteri proizvoda">
        <button className={`filter-chip ${filter === "sve" ? "is-active" : ""}`} onClick={() => setFilter("sve")}>Sve</button>
        {popularCategories.map((category) => <button key={category} className={`filter-chip ${filter === category ? "is-active" : ""}`} onClick={() => setFilter(category)}>{categoryLabels[category]}</button>)}
        {concerns.slice(0, 4).map((concern) => <button key={concern.id} className={`filter-chip ${filter === concern.id ? "is-active" : ""}`} onClick={() => setFilter(concern.id)}>{concern.name}</button>)}
      </div>
      <section className="catalog-wrap">
        <div className="catalog-tools">
          <div><SlidersHorizontal size={16} /><span><strong>{filtered.length}</strong> pažljivo odabrana proizvoda</span></div>
          <label className="catalog-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pretraži katalog" aria-label="Pretraži katalog" /></label>
          <label className="catalog-sort"><span>Sortiraj</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sortiraj proizvode"><option value="equa">EQUA izbor</option><option value="rating">Najbolje ocenjeni</option><option value="price-low">Cena: niža prvo</option><option value="price-high">Cena: viša prvo</option></select></label>
        </div>
        {filtered.length ? <div className="catalog-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>Nema rezultata za ovaj filter.</h2><button className="button button--dark" onClick={() => setFilter("sve")}>Prikaži sve</button></div>}
      </section>
    </>
  );
}
