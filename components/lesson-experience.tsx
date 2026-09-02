"use client";

/* eslint-disable @next/next/no-img-element -- checked-in campaign and product photography is used as the lesson demo poster. */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ListVideo, MessageCircle, Pause, Play, Plus, ShoppingBag, Sparkles } from "lucide-react";
import type { Course, CourseLesson } from "@/lib/data/types";
import { brandById, formatRsd, productById } from "@/lib/data/catalog";
import { productPhotoFor } from "./product-photo";
import { productColor, toCommerceProduct } from "@/lib/ui";
import { useCommerce } from "./commerce-store";
import { useLearning } from "./learning-store";

export function LessonExperience({ course, lesson }: { course: Course; lesson: CourseLesson }) {
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [tab, setTab] = useState<"notes" | "transcript">("notes");
  const { addToCart, addToRoutine } = useCommerce();
  const { completeLesson, isComplete } = useLearning();
  const products = lesson.productIds.map((id) => productById[id]);
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const lessonIndex = allLessons.findIndex((candidate) => candidate.id === lesson.id);
  const previous = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const next = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;
  const durationSeconds = lesson.durationMinutes * 60;
  const progress = Math.min(100, seconds / durationSeconds * 100);
  const complete = isComplete(lesson.id);

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => setSeconds((value) => value >= durationSeconds ? 0 : value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [durationSeconds, playing]);

  const timeLabel = useMemo(() => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);

  function addLessonRoutine() {
    for (const product of products) {
      addToCart(toCommerceProduct(product));
      addToRoutine(toCommerceProduct(product), product.timeOfDay.length === 2 ? "AM + PM" : product.timeOfDay[0].toUpperCase() as "AM" | "PM");
    }
  }

  return (
    <div className="lesson-page">
      <aside className="lesson-sidebar">
        <Link className="lesson-sidebar__back" href={`/academy/${course.slug}`}><ArrowLeft size={15} /> {course.title}</Link>
        <div className="lesson-sidebar__progress"><span>{lessonIndex + 1}/{allLessons.length}</span><i><b style={{ width: `${(lessonIndex + (complete ? 1 : 0)) / allLessons.length * 100}%` }} /></i></div>
        <nav aria-label="Sadržaj kursa">{course.modules.map((module) => <div key={module.id}><strong>{module.title}</strong>{module.lessons.map((item) => <Link className={`${item.id === lesson.id ? "is-active" : ""} ${isComplete(item.id) ? "is-complete" : ""}`} href={`/academy/${course.slug}/${item.slug}`} key={item.id}><span>{isComplete(item.id) ? <Check size={12} /> : <Play size={12} />}</span>{item.title}<small>{item.durationMinutes}m</small></Link>)}</div>)}</nav>
      </aside>

      <div className="lesson-main">
        <header className="lesson-heading"><div><p className="eyebrow">Lekcija {lessonIndex + 1} · {lesson.durationMinutes} min</p><h1>{lesson.title}</h1><p>{lesson.summary}</p></div><button className={`button ${complete ? "button--ghost" : "button--dark"}`} type="button" onClick={() => void completeLesson(course.id, lesson.id)}>{complete ? <CheckCircle2 size={17} /> : <Check size={17} />}{complete ? "Završeno" : "Označi kao završeno"}</button></header>

        <section className="lesson-player" aria-label="Demo video lekcija">
          <img src={lesson.image} alt="" width={1800} height={1126} />
          <div className="lesson-player__shade" />
          <button className="lesson-player__play" type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pauziraj demo lekciju" : "Pusti demo lekciju"}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
          <div className="lesson-player__brand">EQUA <span>classroom</span></div>
          <div className="lesson-player__controls"><button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pauziraj video" : "Pusti video"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><span>{timeLabel}</span><i><b style={{ width: `${progress}%` }} /></i><span>{lesson.durationMinutes}:00</span><small>DEMO LEKCIJA</small></div>
        </section>

        <div className="lesson-content-grid">
          <section className="lesson-notes">
            <div className="lesson-tabs" role="tablist"><button className={tab === "notes" ? "is-active" : ""} onClick={() => setTab("notes")} role="tab" aria-selected={tab === "notes"}><ListVideo size={16} /> Poglavlja i zadaci</button><button className={tab === "transcript" ? "is-active" : ""} onClick={() => setTab("transcript")} role="tab" aria-selected={tab === "transcript"}>Transkript</button></div>
            {tab === "notes" ? <><div className="lesson-chapters">{lesson.chapters.map((chapter) => <button type="button" key={chapter.time} onClick={() => setSeconds(Number(chapter.time.split(":")[0]) * 60 + Number(chapter.time.split(":")[1]))}><span>{chapter.time}</span><strong>{chapter.label}</strong><Play size={13} /></button>)}</div><div className="lesson-checklist"><p className="eyebrow">Posle lekcije</p>{lesson.checklist.map((item) => <label key={item}><input type="checkbox" /><span>{item}</span></label>)}</div></> : <div className="lesson-transcript">{lesson.transcript.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="lesson-disclaimer">Edukativni sadržaj nije medicinska dijagnoza. Kod upornih ili naglih promena obrati se dermatologu.</p></div>}
          </section>

          <aside className="lesson-products">
            <div className="lesson-products__head"><div><p className="eyebrow">Pomenuto u lekciji</p><h2>Rutina iz ovog poglavlja.</h2></div><span>{products.length} proizvoda</span></div>
            {products.map((product, index) => <article key={product.id}><div className="lesson-product__photo" style={{ "--product-accent": productColor(product) } as React.CSSProperties}><img src={productPhotoFor(product)} alt={`${product.name}, ${product.size}`} width={600} height={600} /></div><div className="lesson-product__copy"><span>{String(index + 1).padStart(2, "0")} · {brandById[product.brandId].name}</span><h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3><p>{index === 0 ? "Osnova koja smanjuje broj promenljivih u rutini." : "Podrška barijeri sa jasnim mestom u redosledu."}</p><div><strong>{formatRsd(product.priceRsd)}</strong><button type="button" onClick={() => addToCart(toCommerceProduct(product))} aria-label={`Dodaj ${product.name} u korpu`}><Plus size={15} /> Dodaj</button></div></div></article>)}
            <button className="button button--dark button--full" type="button" onClick={addLessonRoutine}><ShoppingBag size={17} /> Dodaj celu rutinu</button>
            <small className="lesson-products__note"><Sparkles size={13} /> Cena i dostupnost se proveravaju ponovo pri kupovini.</small>
          </aside>
        </div>

        <section className="lesson-discussion"><div><MessageCircle /><div><p className="eyebrow">Diskusija uz lekciju</p><h2>Postavi pitanje dok je kontekst svež.</h2><p>Razgovor je povezan sa programom, pa ekspert i drugi polaznici znaju na koji korak misliš.</p></div></div><Link className="button button--ghost" href={`/community?space=${course.slug}`}>Otvori diskusiju <ArrowRight size={16} /></Link></section>

        <nav className="lesson-pagination" aria-label="Kretanje kroz lekcije">{previous ? <Link href={`/academy/${course.slug}/${previous.slug}`}><ArrowLeft /><span>Prethodna<strong>{previous.title}</strong></span></Link> : <span />}{next ? <Link href={`/academy/${course.slug}/${next.slug}`}><span>Sledeća lekcija<strong>{next.title}</strong></span><ArrowRight /></Link> : <Link href="/account"><span>Program završen<strong>Otvori Moj EQUA</strong></span><CheckCircle2 /></Link>}</nav>
      </div>
    </div>
  );
}
