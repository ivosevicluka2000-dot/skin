"use client";

/* eslint-disable @next/next/no-img-element -- These checked-in, pre-compressed campaign assets are served directly. */

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowRight, BookOpen, Check, Clock3, MessageCircle, MoveRight, Play, ShoppingBag, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Article, Concern, Course, Product } from "@/lib/data/types";
import { courseDuration, courseLessonCount } from "@/lib/data";
import { ProductCard } from "./product-card";

type Props = {
  concerns: readonly Concern[];
  products: readonly Product[];
  articles: readonly Article[];
  courses: readonly Course[];
};

export function HomeExperience({ concerns, products, articles, courses }: Props) {
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
      if (!response.ok) throw new Error("request failed");
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
          <p className="eyebrow">Akademija · Skin Check · Shop · Club</p>
          <h1 className="display-title">Razumi kožu. Izgradi rutinu koja <em>radi.</em></h1>
          <p className="hero__lead">Jedan nalog povezuje video lekcije, stručne vodiče, personalizovanu rutinu, kupovinu i zajednicu koja zna kontekst.</p>
          <div className="hero__actions">
            <Link className="button button--dark" href="/quiz">Uradi skin check <ArrowRight size={17} /></Link>
            <Link className="button button--ghost" href="/academy"><Play size={16} /> Otvori Akademiju</Link>
          </div>
          <div className="hero__proof">
            <div className="hero__proof-avatars"><span /><span /><span /></div>
            <span>MVP demo · od signala do lekcije i rutine za 3 minuta</span>
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
              <Link className="concern-card concern-card--image" href={`/concerns/${concern.slug}`}>
                <img className="concern-card__image" src={concern.image} alt="" width={592} height={592} loading="lazy" decoding="async" />
                <span className="concern-card__number">0{index + 1}</span><span className="concern-card__orb" />
                <div className="concern-card__bottom"><div><h3>{concern.name}</h3><p>{concern.shortDescription}</p></div><span className="concern-card__arrow"><ArrowDownRight size={20} /></span></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="home-paths" aria-label="Izaberi kako želiš da počneš">
        <Link href="/quiz"><span>01</span><Sparkles /><div><small>Imam problem</small><h2>Želim personalizovan plan.</h2><p>Skin Blueprint povezuje stanje, cilj i realan ritam nege.</p></div><ArrowRight /></Link>
        <Link href="/academy"><span>02</span><BookOpen /><div><small>Želim da naučim</small><h2>Želim da razumem zašto.</h2><p>Video programi, checkliste i diskusije vezane za lekciju.</p></div><ArrowRight /></Link>
        <Link href="/shop"><span>03</span><ShoppingBag /><div><small>Znam šta tražim</small><h2>Želim kuriran izbor.</h2><p>Proizvodi sa jasnim mestom, redosledom i safety napomenama.</p></div><ArrowRight /></Link>
      </section>

      <section className="home-academy">
        <div className="section-heading-row"><div><p className="eyebrow">EQUA Akademija</p><h2 className="section-title">Jedna lekcija. Više pravih odluka.</h2></div><Link className="text-link" href="/academy">Svi programi <ArrowRight size={17} /></Link></div>
        <div className="home-course-grid">
          <Link className="home-course-feature" href={`/academy/${courses[0].slug}`}>
            <img src={courses[0].image} alt="Skin Barrier Reset video program" width={1800} height={1126} loading="lazy" decoding="async" />
            <span className="home-course-feature__shade" />
            <div className="home-course-feature__copy"><p className="eyebrow">Besplatan program · 14 dana</p><h3>{courses[0].title}</h3><p>{courses[0].description}</p><div><span><Play /> {courseLessonCount(courses[0])} lekcija</span><span><Clock3 /> {courseDuration(courses[0])} min</span></div><strong>Počni program <ArrowRight /></strong></div>
          </Link>
          <div className="home-lesson-shop"><div className="home-lesson-shop__top"><span className="home-lesson-shop__play"><Play fill="currentColor" /></span><div><small>03:42 · proizvod pomenut u lekciji</small><strong>Zašto ceramidi dolaze posle humektansa?</strong></div></div><div className="home-lesson-shop__product"><img src="/images/products/cream.jpg" alt="Ceramide Comfort Cream" width={600} height={600} loading="lazy" /><div><span>Terra Calm</span><h3>Ceramide Comfort Cream</h3><p>Korak 03 · zaključava vlagu bez aktivnog opterećenja.</p><strong>3.390 RSD</strong></div><button aria-label="Otvori lekciju"><ArrowRight /></button></div><p className="home-lesson-shop__note">Proizvodi nisu reklama preko videa — pojavljuju se uz razlog, redosled i alternativu.</p></div>
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
          <p className="eyebrow">Skin check · 9 pitanja · oko 3 min</p>
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
        <div className="article-grid">{articles.slice(0, 3).map((article) => <Link className="article-card" href={`/journal/${article.slug}`} key={article.id}><div className="article-card__visual"><img src={article.image} alt="" width={1200} height={800} loading="lazy" decoding="async" /></div><div className="article-card__copy"><span>{article.eyebrow} · {article.readingMinutes} min</span><h3>{article.title}</h3><span className="text-link">Pročitaj vodič <ArrowRight size={14} /></span></div></Link>)}</div>
      </section>

      <section className="home-community">
        <div><p className="eyebrow">EQUA Club</p><h2 className="section-title">Zajednica koja zna na kojoj si lekciji.</h2><p>Postavi pitanje iz programa, podeli napredak i dobij odgovor bez ponavljanja cele rutine od početka.</p><div className="community-hero__stats"><span><Users /> prostori po programu</span><span><MessageCircle /> ekspertni check-in</span></div><Link className="button button--dark" href="/community">Otvori zajednicu <ArrowRight size={16} /></Link></div><div className="home-community__thread"><span className="community-avatar">MP</span><div><small>dr Mina Petrović · EQUA ekspert</small><h3>Nedeljni check-in: šta je danas mirnije?</h3><p>Napišite jednu stvar koja se poboljšala i jednu koja je još nejasna. Odgovaram večeras.</p><div><span>24 odgovora</span><span>61 korisno</span></div></div></div>
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
