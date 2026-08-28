import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  articles,
  brandById,
  concernById,
  formatRsd,
  ingredientById,
  productById,
} from "@/lib/data/catalog";
import { notFound } from "next/navigation";
import styles from "./article.module.css";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) return { title: "Vodič nije pronađen" };

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) notFound();

  const relatedProducts = article.relatedProductIds.map((id) => productById[id]);

  return (
    <article>
      <div className={styles.hero}>
        <div className="breadcrumbs">
          <Link href="/journal"><ArrowLeft size={13} /> Svi vodiči</Link>
          <span>/</span>
          <span>{article.eyebrow}</span>
        </div>
        <header className={styles.heroInner}>
          <div>
            <p className="eyebrow">{article.eyebrow}</p>
            <h1>{article.title}</h1>
          </div>
          <div>
            <p className={styles.lead}>{article.excerpt}</p>
            <div className={styles.meta}>
              <span>{article.author}</span>
              <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${article.publishedAt}T12:00:00Z`))}</time>
              <span>{article.readingMinutes} min čitanja</span>
            </div>
          </div>
        </header>
      </div>

      <div className={styles.layout}>
        <aside className={styles.aside}>
          <p className={styles.asideLabel}>U ovom vodiču</p>
          <div className={styles.asideLinks}>
            {article.concernIds.map((id) => (
              <Link href={`/concerns/${concernById[id].slug}`} key={id}>{concernById[id].name}</Link>
            ))}
            {article.ingredientIds.map((id) => (
              <Link href={`/ingredients#${ingredientById[id].slug}`} key={id}>{ingredientById[id].name}</Link>
            ))}
          </div>
        </aside>

        <div className={styles.body}>
          {article.sections.map((section) => (
            <section className={styles.section} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.callout && <div className={styles.callout}>{section.callout}</div>}
            </section>
          ))}
        </div>
      </div>

      <section className={styles.products}>
        <p className="eyebrow">Shop the guide</p>
        <h2 className="section-title">Proizvodi iz ove priče.</h2>
        <div className={styles.productGrid}>
          {relatedProducts.map((product) => (
            <Link className={styles.product} href={`/product/${product.slug}`} key={product.id}>
              <div>
                <small>{brandById[product.brandId].name} · {product.size}</small>
                <h3>{product.name}</h3>
                <p>{product.shortDescription}</p>
              </div>
              <strong>{formatRsd(product.priceRsd)} <ArrowUpRight size={14} /></strong>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
