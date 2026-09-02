"use client";

/* eslint-disable @next/next/no-img-element -- checked-in course photography is part of the program catalog. */

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, Play, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Course } from "@/lib/data/types";
import { courseDuration, courseLessonCount } from "@/lib/data";
import { AcademyNav } from "./academy-experience";

const levelOptions = [
  { value: "all", label: "Svi nivoi" },
  { value: "početni", label: "Početni" },
  { value: "srednji", label: "Srednji" },
] as const;

export function ProgramLibrary({ courses }: { courses: readonly Course[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [access, setAccess] = useState<"all" | "free" | "premium">("all");
  const [sort, setSort] = useState<"featured" | "shortest" | "price">("featured");

  const visibleCourses = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("sr-Latn");
    return [...courses]
      .filter((course) => level === "all" || course.level === level)
      .filter((course) => access === "all" || (access === "free" ? course.priceRsd === 0 : course.priceRsd > 0))
      .filter((course) => !needle || `${course.title} ${course.description} ${course.outcome}`.toLocaleLowerCase("sr-Latn").includes(needle))
      .sort((a, b) => sort === "shortest" ? courseDuration(a) - courseDuration(b) : sort === "price" ? a.priceRsd - b.priceRsd : Number(b.featured) - Number(a.featured));
  }, [access, courses, level, query, sort]);

  return (
    <div className="program-library-page">
      <AcademyNav active="programs" />
      <header className="program-library-hero">
        <div><Link href="/academy"><ArrowLeft /> Akademija</Link><p className="eyebrow">Biblioteka programa</p><h1>Uči ono što tvojoj koži <em>sada</em> treba.</h1></div>
        <div><strong>{courses.length}</strong><span>vođena programa</span><p>Video lekcije, checkliste, diskusije i proizvodi u kontekstu.</p></div>
      </header>

      <section className="program-filter" aria-label="Filteri programa">
        <label className="program-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pretraži program ili cilj…" aria-label="Pretraži programe" /></label>
        <div className="program-filter__chips" aria-label="Nivo programa">{levelOptions.map((option) => <button className={level === option.value ? "is-active" : ""} type="button" onClick={() => setLevel(option.value)} key={option.value}>{option.label}</button>)}</div>
        <div className="program-filter__chips" aria-label="Pristup programu"><button className={access === "all" ? "is-active" : ""} onClick={() => setAccess("all")}>Svi</button><button className={access === "free" ? "is-active" : ""} onClick={() => setAccess("free")}>Besplatni</button><button className={access === "premium" ? "is-active" : ""} onClick={() => setAccess("premium")}>Premium</button></div>
        <label className="program-sort"><SlidersHorizontal /><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Sortiraj programe"><option value="featured">Izdvojeno</option><option value="shortest">Najkraće prvo</option><option value="price">Cena rastuće</option></select></label>
      </section>

      <div className="program-results-head"><span>{visibleCourses.length} {visibleCourses.length === 1 ? "program" : "programa"}</span><small>Filteri se primenjuju odmah</small></div>
      <section className="program-grid" aria-live="polite">
        {visibleCourses.map((course, index) => (
          <article className="program-card" key={course.id} style={{ "--program-accent": course.accent } as React.CSSProperties}>
            <Link className="program-card__visual" href={`/academy/${course.slug}`}><img src={course.image} alt="" width={1000} height={700} /><span>{String(index + 1).padStart(2, "0")}</span><b>{course.priceRsd === 0 ? "Besplatno" : `${course.priceRsd.toLocaleString("sr-RS")} RSD`}</b></Link>
            <div className="program-card__body"><div className="program-card__meta"><span>{course.level}</span><span><Clock3 /> {courseDuration(course)} min</span><span><Play /> {courseLessonCount(course)} lekcija</span></div><h2>{course.title}</h2><p>{course.description}</p><div className="program-card__outcome"><Sparkles /><span><small>Rezultat</small>{course.outcome}</span></div><Link className="button button--dark button--full" href={`/academy/${course.slug}`}>Otvori program <ArrowRight /></Link></div>
          </article>
        ))}
        {!visibleCourses.length && <div className="program-empty"><Search /><h2>Nema programa za ovu kombinaciju.</h2><p>Probaj drugi nivo ili ukloni deo pretrage.</p><button className="button button--ghost" onClick={() => { setQuery(""); setLevel("all"); setAccess("all"); }}>Obriši filtere</button></div>}
      </section>
    </div>
  );
}
