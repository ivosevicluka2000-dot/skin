"use client";

/* eslint-disable @next/next/no-img-element -- Vinext serves these checked-in, pre-compressed campaign assets directly. */

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowRight, Check, MoveRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { Article, Concern, Product } from "@/lib/data/types";
import { ProductCard } from "./product-card";

type Props = {
  concerns: readonly Concern[];
  products: readonly Product[];
  articles: readonly Article[];
};

export function HomeExperience({ concerns, products, articles }: Props) {
  const [newsletterState, setNewsletterState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterState("loading");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), source: "homepage", consent: true }),
      });
      if (!response.ok && response.status !== 503) throw new Error("request failed");
      setNewsletterState("success");
      event.currentTarget.reset();
    } catch {
      setNewsletterState("error");
    }
  }

  return (
    <>
      <section className="hero">
        <motion.div className="hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <p className="eyebrow">Kurirana nega · pametne rutine</p>
          <h1 className="display-title">Tvoja koža nije <em>kategorija.</em></h1>
          <p className="hero__lead">Ne prodajemo još jedan korak. Povezujemo problem, sastojak i proizvod u rutinu koju stvarno možeš da pratiš.</p>
          <div className="hero__actions">
            <Link className="button button--dark" href="/quiz">Uradi skin check <ArrowRight size={17} /></Link>
            <Link className="button button--ghost" href="/shop">Istraži negu</Link>
          </div>
          <div className="hero__proof">
            <div className="hero__proof-avatars"><span /><span /><span /></div>
            <span>4.9 prosečna ocena zajednice · 2 minuta do rutine</span>
          </div>
        </motion.div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }}>
          <img className="hero-visual__photo" src="/images/campaign/equa-ritual-hero.jpg" alt="EQUA serum, krema i SPF u jutarnjem skincare ritualu" width={1800} height={1126} />
          <div className="hero-visual__shade" />
          <span className="hero-visual__tag hero-visual__tag--one">EQUA ritual · formula pre trenda</span>
          <span className="hero-visual__tag hero-visual__tag--two">Kurirano za tvoju kožu</span>
          <div className="hero-visual__counter"><strong>01</strong><span>počni od kože, ne trenda</span></div>
        </motion.div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {["Rutina pre haula", "Barijera pre aktiva", "SPF svakog jutra", "Manje nagađanja", "Rutina pre haula", "Barijera pre aktiva", "SPF svakog jutra", "Manje nagađanja"].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
        </div>
      </div>

      <section className="concern-section">
        <div className="section-heading-row">
          <div><p className="eyebrow">Počni od onoga što vidiš i osećaš</p><h2 className="section-title">Šta danas treba tvojoj koži?</h2></div>
          <p>Ne moraš da znaš naziv sastojka. Izaberi problem, a mi ćemo objasniti šta ima smisla i kojim redosledom.</p>
        </div>
        <div className="concern-grid">
          {concerns.slice(0, 4).map((concern, index) => (
            <motion.div key={concern.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * .07 }}>
              <Link className="concern-card" href={`/concerns/${concern.slug}`}>
                <span className="concern-card__number">0{index + 1}</span><span className="concern-card__orb" />
                <div className="concern-card__bottom"><div><h3>{concern.name}</h3><p>{concern.shortDescription}</p></div><span className="concern-card__arrow"><ArrowDownRight size={20} /></span></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bridge-section">
        <motion.div className="bridge-visual" initial={{ rotate: -1.5, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} viewport={{ once: true }}>
          <img className="bridge-visual__photo" src="/images/products/cream.jpg" alt="Minimalistička krema kao treći korak EQUA rutine" width={1200} height={1200} loading="lazy" decoding="async" />
          <span className="bridge-visual__shade" />
          <div className="bridge-visual__note"><span>skin logic™</span><span>03 / 04</span></div>
        </motion.div>
        <div className="bridge-copy">
          <p className="eyebrow">EQUA metod</p>
          <h2 className="section-title">Od simptoma do smislenog rituala.</h2>
          <p className="bridge-copy__lead">Kupovina nege obično počinje trendom. Kod nas počinje kontekstom: kako se koža ponaša, šta već koristiš i koliko koraka ti realno odgovara.</p>
          <div className="bridge-steps">
            <div className="bridge-step"><span>01</span><strong>Prepoznaj signal</strong><small>problem kože</small></div>
            <div className="bridge-step"><span>02</span><strong>Razumi sastojak</strong><small>jasan vodič</small></div>
            <div className="bridge-step"><span>03</span><strong>Složi redosled</strong><small>AM / PM rutina</small></div>
          </div>
          <Link className="text-link" href="/ingredients">Otvori mapu sastojaka <MoveRight size={18} /></Link>
        </div>
      </section>

      <section className="shop-section">
        <div className="section-heading-row">
          <div><p className="eyebrow">Kurirano, ne beskonačno</p><h2 className="section-title">Proizvodi sa jasnim mestom u rutini.</h2></div>
          <Link className="text-link" href="/shop">Svi proizvodi <ArrowRight size={17} /></Link>
        </div>
        <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="quiz-banner">
        <div className="quiz-banner__copy">
          <p className="eyebrow">Skin check · 7 pitanja · oko 2 min</p>
          <h2 className="section-title">Ne treba ti više proizvoda. Treba ti bolji redosled.</h2>
          <p>Odgovori na nekoliko pitanja i dobićeš bezbednu AM/PM rutinu koju možeš da menjaš, sačuvaš i dodaš u korpu.</p>
          <Link className="button button--dark" href="/quiz">Pokreni skin check <Sparkles size={17} /></Link>
        </div>
        <motion.div className="quiz-orbit" whileInView={{ rotate: 4 }} transition={{ type: "spring", stiffness: 70 }} viewport={{ once: true }}>
          <div className="quiz-orbit__core">Tvoj skin signal</div><span className="quiz-orbit__chip">osetljivost</span><span className="quiz-orbit__chip">ritam</span><span className="quiz-orbit__chip">cilj</span>
        </motion.div>
      </section>

      <section className="journal-section">
        <div className="section-heading-row"><div><p className="eyebrow">EQUA journal</p><h2 className="section-title">Znanje koje staje između dva koraka.</h2></div><Link className="text-link" href="/journal">Svi vodiči <ArrowRight size={17} /></Link></div>
        <div className="article-grid">{articles.slice(0, 3).map((article) => <Link className="article-card" href={`/journal/${article.slug}`} key={article.id}><div className="article-card__visual" /><div className="article-card__copy"><span>{article.eyebrow} · {article.readingMinutes} min</span><h3>{article.title}</h3><span className="text-link">Pročitaj vodič <ArrowRight size={14} /></span></div></Link>)}</div>
      </section>

      <section className="newsletter-section" id="newsletter">
        <div><p className="eyebrow">Inbox, ali koristan</p><h2 className="section-title">Jedan dobar savet. Jednom nedeljno.</h2><p>Bez daily spama i čudotvornih obećanja. Samo praktični vodiči, nove formule i rutine koje imaju smisla.</p></div>
        <div>
          <form className="newsletter-form" onSubmit={submitNewsletter}><input required type="email" name="email" aria-label="Email za newsletter" placeholder="tvoj@email.rs" /><button aria-label="Prijavi se" disabled={newsletterState === "loading"}>{newsletterState === "success" ? <Check /> : <ArrowRight />}</button></form>
          <span className="newsletter-status" role="status">{newsletterState === "loading" && "Šaljemo…"}{newsletterState === "success" && "Tu si. Prvi pametan savet stiže uskoro."}{newsletterState === "error" && "Nije prošlo iz prve. Pokušaj ponovo za trenutak."}</span>
        </div>
      </section>
    </>
  );
}
