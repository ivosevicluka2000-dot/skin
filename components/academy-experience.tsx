"use client";

/* eslint-disable @next/next/no-img-element -- checked-in EQUA Academy photography is part of the learning experience. */

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MessageCircle,
  Play,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { Course } from "@/lib/data/types";
import { courseDuration, courseLessonCount } from "@/lib/data";
import { CourseProgress } from "./course-progress";
import { useLearning } from "./learning-store";
import { useMember } from "./member-store";

function priceLabel(price: number) {
  return price === 0
    ? "Besplatno"
    : new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(price);
}

function AcademyNav({ active }: { active: "home" | "programs" }) {
  return (
    <nav className="academy-subnav" aria-label="Akademija navigacija">
      <Link className={active === "home" ? "is-active" : ""} href="/academy">Početna</Link>
      <Link className={active === "programs" ? "is-active" : ""} href="/academy/programs">Programi</Link>
      <Link href="/community">Zajednica</Link>
      <Link href="/account">Moj napredak</Link>
    </nav>
  );
}

export function AcademyExperience({ courses }: { courses: readonly Course[] }) {
  const { member, checking } = useMember();
  const { enrolledCourseIds, completedLessonIds } = useLearning();
  const featured = courses[0];

  if (checking) return <div className="member-checking"><span /><h1>EQUA Akademija</h1><p>Otvaramo tvoje programe…</p></div>;

  if (!member) {
    return (
      <div className="academy-landing">
        <section className="academy-landing-hero">
          <div className="academy-landing-hero__copy">
            <p className="eyebrow">EQUA Akademija · znanje koje ostaje</p>
            <h1>Ne učiš sastojke napamet. Učiš da <em>čitaš svoju kožu.</em></h1>
            <p>Vođeni video programi, mali praktični koraci i proizvodi prikazani tek kada imaju smisla u lekciji.</p>
            <div className="hero__actions">
              <Link className="button button--dark" href="/join?returnTo=%2Facademy">Pristupi Akademiji <ArrowRight size={17} /></Link>
              <Link className="button button--ghost" href="#programi">Pogledaj programe</Link>
            </div>
            <div className="academy-landing-proof">
              <span><Play /> kratke video lekcije</span>
              <span><CheckCircle2 /> checkliste i napredak</span>
              <span><MessageCircle /> diskusija uz program</span>
            </div>
          </div>

          <div className="academy-portal-preview" aria-label="Pregled članske Akademije">
            <div className="academy-portal-preview__bar"><span>equa° academy</span><div><i /><i /><i /></div></div>
            <div className="academy-portal-preview__tabs"><b>Početna</b><span>Programi</span><span>Zajednica</span><span>Kalendar</span></div>
            <div className="academy-portal-preview__course">
              <img src={featured.image} alt="Skin Barrier Reset program" width={1200} height={800} />
              <span className="academy-portal-preview__shade" />
              <div><small>Nastavi gde si stao/la · 36%</small><h2>{featured.title}</h2><span>02 · Suva, dehidrirana ili iritirana?</span><b><Play fill="currentColor" /> Nastavi lekciju</b></div>
            </div>
            <div className="academy-portal-preview__mini"><span><CalendarDays /><b>Sledeći live</b>Četvrtak · 19:00</span><span><Users /><b>EQUA Club</b>46 aktivnih tema</span></div>
          </div>
        </section>

        <section className="academy-preview" id="programi">
          <div className="section-heading-row"><div><p className="eyebrow">Programi za stvaran život</p><h2 className="section-title">Od prvog signala do sigurne rutine.</h2></div><p>Svaki program ima jasne module, trajanje, rezultat i proizvode vezane za konkretan deo lekcije.</p></div>
          <div className="academy-preview-grid">
            {courses.map((course, index) => (
              <Link className="academy-preview-card" href={`/academy/${course.slug}`} key={course.id}>
                <div><img src={course.image} alt="" width={900} height={600} loading="lazy" /><span>0{index + 1}</span><b>{priceLabel(course.priceRsd)}</b></div>
                <section><small>{course.eyebrow}</small><h3>{course.title}</h3><p>{course.description}</p><footer><span><Play /> {courseLessonCount(course)} lekcija</span><span><Clock3 /> {courseDuration(course)} min</span><ArrowRight /></footer></section>
              </Link>
            ))}
          </div>
        </section>

        <section className="academy-method">
          <div><span>01</span><BookOpen /><h2>Razumeš</h2><p>Kratka lekcija objašnjava šta vidiš i zašto se to dešava.</p></div>
          <div><span>02</span><Sparkles /><h2>Primeniš</h2><p>Checklistom pretvaraš znanje u jedan mali korak u rutini.</p></div>
          <div><span>03</span><MessageCircle /><h2>Proveriš</h2><p>Postaviš pitanje zajednici bez ponavljanja celog konteksta.</p></div>
        </section>
      </div>
    );
  }

  const firstName = member.name.split(" ")[0];
  const activeCourse = courses.find((course) => enrolledCourseIds.includes(course.id)) ?? featured;
  const nextLesson = activeCourse.modules.flatMap((module) => module.lessons).find((lesson) => !completedLessonIds.includes(lesson.id)) ?? activeCourse.modules[0].lessons[0];

  return (
    <div className="academy-hub">
      <AcademyNav active="home" />
      <section className="academy-hub-welcome">
        <div><p className="eyebrow">Dobro došao/la nazad, {firstName}</p><h1>Tvoj sledeći dobar korak.</h1><p>Nastavi program, proveri današnju checklistu ili otvori razgovor vezan za lekciju.</p></div>
        <div className="academy-hub-stats"><span><strong>{completedLessonIds.length}</strong>završenih lekcija</span><span><strong>{Math.max(1, enrolledCourseIds.length)}</strong>aktivan program</span><span><strong>4</strong>dana u nizu</span></div>
      </section>

      <section className="academy-hub-grid">
        <Link className="academy-continue" href={`/academy/${activeCourse.slug}/${nextLesson.slug}`}>
          <img src={activeCourse.image} alt="" width={1200} height={800} />
          <span className="academy-continue__shade" />
          <div className="academy-continue__top"><span>Nastavi program</span><b>{activeCourse.level}</b></div>
          <div className="academy-continue__body"><small>{activeCourse.title}</small><h2>{nextLesson.title}</h2><p>{nextLesson.summary}</p><CourseProgress course={activeCourse} compact /><strong><Play fill="currentColor" /> Nastavi lekciju</strong></div>
        </Link>
        <aside className="academy-today">
          <div className="academy-today__head"><div><p className="eyebrow">Danas u Akademiji</p><h2>Ostani u ritmu.</h2></div><CalendarDays /></div>
          <Link href="/community"><span className="is-lime"><MessageCircle /></span><div><small>Diskusija</small><strong>Weekly Expert Room</strong><p>Kožna barijera i povratak aktiva · 19:00</p></div><ArrowRight /></Link>
          <Link href="/academy/programs"><span className="is-lilac"><GraduationCap /></span><div><small>Biblioteka</small><strong>{courses.length} programa je spremno</strong><p>Filtriraj po cilju, nivou i trajanju.</p></div><ArrowRight /></Link>
          <div className="academy-rank"><Trophy /><span><small>Nedeljni napredak</small><strong>Top 18% članova</strong></span></div>
        </aside>
      </section>

      <section className="academy-hub-programs">
        <div className="section-heading-row"><div><p className="eyebrow">Tvoja biblioteka</p><h2 className="section-title">Biraj program, ne još jedan savet.</h2></div><Link className="text-link" href="/academy/programs">Svi programi <ArrowRight /></Link></div>
        <div>{courses.slice(0, 3).map((course, index) => <Link href={`/academy/${course.slug}`} key={course.id}><span style={{ background: course.accent }}>0{index + 1}</span><div><small>{course.eyebrow}</small><h3>{course.title}</h3></div><b>{courseLessonCount(course)} lekcija</b><ArrowRight /></Link>)}</div>
      </section>
    </div>
  );
}

export { AcademyNav };
