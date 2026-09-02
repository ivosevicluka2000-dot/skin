import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Vodiči za negu kože",
  description: "Jasni, stručni vodiči o sastojcima, rutinama i potrebama kože — bez nepotrebnog komplikovanja.",
};

const categoryLabels = {
  "osnove-nege": "Osnove nege",
  sastojci: "Sastojci",
  rutine: "Rutine",
  "strucni-vodic": "Stručni vodič",
} as const;

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const activeCategory = category && category in categoryLabels ? category as keyof typeof categoryLabels : undefined;
  const visibleArticles = activeCategory ? articles.filter((article) => article.category === activeCategory) : articles;
  return (
    <>
      <section className="page-hero page-hero--split">
        <div>
          <p className="eyebrow">EQUA journal · znanje pre kupovine</p>
          <h1 className="page-title">Koža nije trend.</h1>
        </div>
        <p>
          Prevodimo nauku o koži u rutine koje možeš da razumeš, pratiš i prilagodiš stvarnom životu.
        </p>
      </section>

      <nav className="filter-bar" aria-label="Kategorije vodiča">
        <Link className={`filter-chip ${activeCategory ? "" : "is-active"}`} href="/journal">Svi vodiči</Link>
        {Object.entries(categoryLabels).map(([id, label]) => (
          <Link className={`filter-chip ${activeCategory === id ? "is-active" : ""}`} href={`/journal?category=${id}`} key={id}>{label}</Link>
        ))}
      </nav>

      <section className="journal-grid" id="svi" aria-label="Svi vodiči">
        {visibleArticles.map((article, index) => (
          <Link className="article-card" href={`/journal/${article.slug}`} key={article.id}>
            <div className="article-card__visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image} alt="" width={1200} height={800} loading={index > 1 ? "lazy" : "eager"} />
              <span className="ingredient-card__symbol" style={{ position: "absolute", left: 24, top: 18, zIndex: 2 }}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="article-card__copy">
              <span>{categoryLabels[article.category]} · {article.readingMinutes} min</span>
              <h2 style={{ margin: "11px 0 14px", fontFamily: "var(--display)", fontSize: 32, fontWeight: 400, lineHeight: 1.02, letterSpacing: "-.035em" }}>
                {article.title}
              </h2>
              <p style={{ margin: "0 0 22px", color: "var(--muted)", fontSize: 13 }}>{article.excerpt}</p>
              <span className="text-link">Pročitaj vodič <ArrowUpRight size={15} /></span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
