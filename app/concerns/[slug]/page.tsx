import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  articles,
  brandById,
  concerns,
  formatRsd,
  ingredientById,
  products,
} from "@/lib/data/catalog";
import { notFound } from "next/navigation";
import { ProductPhoto } from "@/components/product-photo";

/* eslint-disable @next/next/no-img-element -- generated EQUA concern still lifes are checked-in, responsive content imagery. */

type ConcernPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return concerns.map((concern) => ({ slug: concern.slug }));
}

export async function generateMetadata({ params }: ConcernPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concern = concerns.find((item) => item.slug === slug);
  if (!concern) return { title: "Tema nije pronađena" };

  return {
    title: concern.name,
    description: concern.shortDescription,
  };
}

export default async function ConcernPage({ params }: ConcernPageProps) {
  const { slug } = await params;
  const concern = concerns.find((item) => item.slug === slug);
  if (!concern) notFound();

  const relatedProducts = products.filter((product) => product.concernIds.includes(concern.id)).slice(0, 4);
  const relatedArticles = articles.filter((article) => article.concernIds.includes(concern.id)).slice(0, 3);
  const concernIndex = concerns.findIndex((item) => item.id === concern.id) + 1;

  return (
    <>
      <section
        className="concern-detail-hero"
        style={{ "--concern-color": concern.accent } as CSSProperties}
      >
        <div>
          <div className="breadcrumbs">
            <Link href="/"><ArrowLeft size={13} /> Početna</Link>
            <span>/</span>
            <span>Problemi kože</span>
          </div>
          <p className="eyebrow">{concern.eyebrow}</p>
          <h1 className="page-title">{concern.name}</h1>
          <p style={{ maxWidth: 570, margin: "25px 0 32px", fontSize: 19 }}>{concern.shortDescription}</p>
          <Link className="button button--dark" href="/quiz">Složi moju rutinu <ArrowUpRight size={16} /></Link>
        </div>
        <div className="concern-detail-hero__visual">
          <img src={concern.image} alt={`Vizuelni vodič za temu: ${concern.name}`} width={592} height={592} />
          <span aria-hidden="true">{String(concernIndex).padStart(2, "0")}</span>
        </div>
      </section>

      <section className="concern-content">
        <h2 className="section-title">Razumi kožu pre nego što biraš proizvod.</h2>
        <div className="concern-content__body">
          <p>{concern.description}</p>
          <div className="concern-tip">
            <p className="eyebrow">Sastojci koji imaju smisla</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {concern.recommendedIngredientIds.map((id) => (
                <Link className="filter-chip" href={`/ingredients#${ingredientById[id].slug}`} key={id}>
                  {ingredientById[id].name}
                </Link>
              ))}
            </div>
          </div>
          <div className="concern-tip">
            <p className="eyebrow">Jedno pravilo za početak</p>
            <p style={{ margin: 0 }}>
              Uvodi jedan novi proizvod u isto vreme i daj rutini nekoliko nedelja. Ako se pojave uporno peckanje, otok ili svrab, prekini upotrebu i potraži stručni savet.
            </p>
          </div>
        </div>
      </section>

      <section className="ingredient-groups" style={{ background: "var(--paper-2)", paddingTop: 80 }}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Izabrano za ovu temu</p>
            <h2 className="section-title">Rutina počinje ovde.</h2>
          </div>
          <Link className="text-link" href="/shop">Pogledaj celu prodavnicu <ArrowUpRight size={15} /></Link>
        </div>
        <div className="ingredient-grid">
          {relatedProducts.map((product) => (
            <Link className="concern-product-card" href={`/product/${product.slug}`} key={product.id}>
              <div className="concern-product-card__visual">
                <ProductPhoto product={product} />
                <span>{brandById[product.brandId].name} · {product.size}</span>
              </div>
              <div className="concern-product-card__body">
                <div>
                  <span>{brandById[product.brandId].name} · {product.size}</span>
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription}</p>
                </div>
                <div className="concern-product-card__foot">
                  <span>{product.routineStep}</span>
                  <strong>{formatRsd(product.priceRsd)}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="journal-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Znanje pre kupovine</p>
              <h2 className="section-title">Pročitaj sledeće.</h2>
            </div>
            <Link className="text-link" href="/journal">Svi vodiči <ArrowUpRight size={15} /></Link>
          </div>
          <div className="article-grid">
            {relatedArticles.map((article) => (
              <Link className="article-card" href={`/journal/${article.slug}`} key={article.id}>
                <div className="article-card__visual"><img src={article.image} alt="" width={1200} height={800} loading="lazy" decoding="async" /></div>
                <div className="article-card__copy">
                  <span>{article.eyebrow} · {article.readingMinutes} min</span>
                  <h3>{article.title}</h3>
                  <span className="text-link">Pročitaj vodič <ArrowUpRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
