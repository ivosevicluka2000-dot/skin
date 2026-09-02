/* eslint-disable @next/next/no-img-element -- Checked-in course photography is served directly. */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, LockKeyhole, Play, ShoppingBag, UserRound } from "lucide-react";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { CourseProgress, LessonStatus } from "@/components/course-progress";
import { courseBySlug, courseDuration, courseLessonCount, courses } from "@/lib/data";
import { MemberGate } from "@/components/member-gate";

export function generateStaticParams() { return courses.map((course) => ({ slug: course.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const course = courseBySlug[slug]; return course ? { title: course.title, description: course.description } : { title: "Kurs" }; }

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courseBySlug[slug];
  if (!course) notFound();
  const lessons = course.modules.flatMap((module) => module.lessons);
  const firstLesson = lessons[0];
  const price = course.priceRsd === 0 ? "Besplatno" : new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(course.priceRsd);
  return (
    <MemberGate returnTo={`/academy/${course.slug}`} area="academy">
    <div className="course-page">
      <nav className="breadcrumbs" aria-label="Putanja"><Link href="/academy/programs"><ArrowLeft size={13} /> Programi</Link><span>/</span><span>{course.title}</span></nav>
      <section className="course-hero" style={{ "--course-accent": course.accent } as React.CSSProperties}>
        <div className="course-hero__copy"><p className="eyebrow">{course.eyebrow}</p><h1>{course.title}</h1><p className="course-hero__lead">{course.description}</p><div className="course-facts"><span><Clock3 /> {courseDuration(course)} min</span><span><Play /> {courseLessonCount(course)} lekcija</span><span><UserRound /> {course.level}</span></div><div className="course-hero__actions"><CourseEnrollButton courseId={course.id} firstLessonHref={`/academy/${course.slug}/${firstLesson.slug}`} free={course.priceRsd === 0} /><strong>{price}</strong></div><CourseProgress course={course} /></div>
        <div className="course-hero__visual"><img src={course.image} alt={`${course.title} program`} width={1800} height={1126} /><span className="course-play"><Play fill="currentColor" /></span><div><small>Vodi program</small><strong>{course.instructor}</strong><span>{course.instructorRole}</span></div></div>
      </section>

      <section className="course-outcome"><span><CheckCircle2 /></span><div><p className="eyebrow">Rezultat programa</p><h2>{course.outcome}</h2></div></section>

      <section className="curriculum-section"><div className="section-heading-row"><div><p className="eyebrow">Curriculum</p><h2 className="section-title">Jasan put, korak po korak.</h2></div><p>{course.modules.length} modula · {lessons.length} lekcija · praktične checkliste posle svakog poglavlja.</p></div><div className="curriculum-list">{course.modules.map((module) => <details open key={module.id}><summary><div><span>{module.title}</span><strong>{module.summary}</strong></div><small>{module.lessons.length} lekcije</small></summary><div className="curriculum-lessons">{module.lessons.map((lesson, index) => <Link href={`/academy/${course.slug}/${lesson.slug}`} key={lesson.id}><span className="curriculum-lessons__number">{String(index + 1).padStart(2, "0")}</span><div><strong>{lesson.title}</strong><small>{lesson.summary}</small></div><span className="curriculum-lessons__meta">{lesson.preview ? <><Play size={13} /> preview</> : <><LockKeyhole size={13} /> {lesson.durationMinutes} min</>}<LessonStatus lessonId={lesson.id} /></span></Link>)}</div></details>)}</div></section>

      <section className="course-commerce-note"><ShoppingBag /><div><p className="eyebrow">Proizvodi iz lekcija</p><h2>Svaka preporuka dolazi sa razlogom.</h2><p>Uz proizvod vidiš gde pripada, kome odgovara i alternativu. Dodaj pojedinačno ili složi celu rutinu jednim klikom.</p></div><Link className="button button--ghost" href={`/academy/${course.slug}/${firstLesson.slug}`}>Otvori demo lekciju</Link></section>
    </div>
    </MemberGate>
  );
}
