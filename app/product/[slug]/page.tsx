import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/product-art";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { ProductCard } from "@/components/product-card";
import { ReviewPanel } from "@/components/review-panel";
import { brandById, concernById, formatRsd, ingredientById, products } from "@/lib/data/catalog";
import { categoryLabels, productColor, productShape, routineStepLabels } from "@/lib/ui";
import type { Product } from "@/lib/data/types";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((candidate) => candidate.slug === slug);
  return product ? { title: product.name, description: product.shortDescription } : { title: "Proizvod" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = products.find((candidate) => candidate.slug === slug);
  if (!found) notFound();
  const product: Product = found;
  const brand = brandById[product.brandId];
  const related = products.filter((candidate) => candidate.id !== product.id && candidate.concernIds.some((id) => product.concernIds.includes(id))).slice(0, 4);
  return (
    <div className="detail-page">
      <nav className="breadcrumbs" aria-label="Putanja"><Link href="/">Početna</Link><span>/</span><Link href="/shop">Prodavnica</Link><span>/</span><span>{product.name}</span></nav>
      <article className="product-detail">
        <div className="product-detail__visual" style={{ "--detail-color": productColor(product) } as React.CSSProperties}>
          <ProductArt color={productColor(product)} label={brand.name} shape={productShape(product)} />
        </div>
        <div className="product-detail__content">
          <span className="product-detail__brand">{brand.name} · {categoryLabels[product.category]}</span>
          <h1>{product.name}</h1>
          <div className="product-detail__rating"><span aria-label={`${product.rating.average} od 5 zvezdica`}>★★★★★</span><strong>{product.rating.average.toFixed(1)}</strong><span>({product.rating.count} utisaka)</span></div>
          <div className="product-detail__price">{formatRsd(product.priceRsd)} <small>· {product.size}</small></div>
          <p className="product-detail__description">{product.description}</p>
          <div className="fit-grid">
            <div className="fit-item"><span>Korak</span><strong>{routineStepLabels[product.routineStep]}</strong></div>
            <div className="fit-item"><span>Kada</span><strong>{product.timeOfDay.map((time) => time.toUpperCase()).join(" + ")}</strong></div>
            <div className="fit-item"><span>Stanje</span><strong>{product.stock.status === "nema-na-stanju" ? "Uskoro" : "Na stanju"}</strong></div>
          </div>
          <ProductDetailActions product={product} />
          {product.safetyNote && <div className="concern-tip"><strong>Važno:</strong> {product.safetyNote}</div>}
          <div className="accordion">
            <details open><summary>Šta formula radi</summary><p>{product.benefits.join(" · ")}</p></details>
            <details><summary>Kako se koristi</summary><p>{product.usage}</p></details>
            <details><summary>Za koga je</summary><p>{product.concernIds.map((id) => concernById[id].name).join(", ")}. Tipovi kože: {product.skinTypes.join(", ")}.</p></details>
            <details><summary>Ključni sastojci</summary><p>{product.ingredientIds.map((id) => ingredientById[id].name).join(", ")}.</p></details>
          </div>
        </div>
      </article>
      <section className="product-proof-strip" aria-label="EQUA standard"><div><strong>100%</strong><span>jasna uputstva</span></div><div><strong>24h</strong><span>odgovor savetnika</span></div><div><strong>1–3</strong><span>dana do isporuke</span></div><div><strong>0</strong><span>nasumičnih koraka</span></div></section>
      <ReviewPanel productId={product.id} rating={product.rating.average} count={product.rating.count} />
      <section className="related-products"><div className="section-heading-row"><div><p className="eyebrow">Dovrši ritual</p><h2 className="section-title">Dobro radi zajedno.</h2></div><Link className="text-link" href="/shop">Ceo katalog</Link></div><div className="product-grid">{related.map((candidate) => <ProductCard product={candidate} key={candidate.id} />)}</div></section>
    </div>
  );
}
