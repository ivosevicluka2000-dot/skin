import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, GraduationCap, Sparkles } from "lucide-react";
import { CourseProgress } from "@/components/course-progress";
import { courseDuration, courseLessonCount, courses } from "@/lib/data";
import { MemberGate } from "@/components/member-gate";

export const metadata: Metadata = { title: "EQUA Akademija", description: "Video programi koji znanje pretvaraju u rutinu koju možeš da pratiš." };

function priceLabel(price: number) { return price === 0 ? "Besplatno" : new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(price); }

export default function AcademyPage() {
  const featured = courses[0];
  return (
    <MemberGate returnTo="/academy" area="academy">
    <div className="academy-page">
      <section className="academy-hero">
        <div className="academy-hero__copy">
          <p className="eyebrow">EQUA Akademija · uči svojim tempom</p>
          <h1>Znanje koje završava u tvojoj <em>rutini.</em></h1>
          <p>Video lekcije, jasni koraci i proizvodi pomenuti u pravom kontekstu. Bez haula, bez panike, bez dvadeset otvorenih tabova.</p>
          <div className="hero__actions"><Link className="button button--dark" href={`/academy/${featured.slug}`}>Počni besplatni program <ArrowRight size={17} /></Link><Link className="button button--ghost" href="/quiz">Prvo uradi Skin Check</Link></div>
          <div className="academy-proof"><span><GraduationCap /> 3 programa</span><span><BookOpen /> 10 praktičnih lekcija</span><span><Sparkles /> proizvodi u kontekstu</span></div>
        </div>
        <Link className="academy-feature-card" href={`/academy/${featured.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featured.image} alt="EQUA Skin Barrier Reset program" width={1800} height={1126} />
          <div className="academy-feature-card__shade" />
          <div className="academy-feature-card__copy"><span>Najpopularnije · 14 dana</span><h2>{featured.title}</h2><p>{featured.description}</p><CourseProgress course={featured} compact /></div>
        </Link>
      </section>

      <section className="academy-library">
        <div className="section-heading-row"><div><p className="eyebrow">Programi</p><h2 className="section-title">Izaberi sledeći dobar korak.</h2></div><p>Svaki kurs ima video poglavlja, checklistu, diskusiju i rutinu koju možeš da dodaš direktno u korpu.</p></div>
        <div className="course-grid">
          {courses.map((course, index) => (
            <article className="course-card" key={course.id} style={{ "--course-accent": course.accent } as React.CSSProperties}>
              <Link className="course-card__visual" href={`/academy/${course.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.image} alt="" width={1200} height={800} loading="lazy" />
                <span>0{index + 1}</span>
              </Link>
              <div className="course-card__body"><div className="course-card__meta"><span>{course.level}</span><span><Clock3 size={13} /> {courseDuration(course)} min</span><span>{courseLessonCount(course)} lekcija</span></div><h3><Link href={`/academy/${course.slug}`}>{course.title}</Link></h3><p>{course.description}</p><div className="course-card__foot"><strong>{priceLabel(course.priceRsd)}</strong><Link className="text-link" href={`/academy/${course.slug}`}>Pogledaj program <ArrowRight size={14} /></Link></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="academy-loop"><div><p className="eyebrow">Learning commerce</p><h2>Nije „pogledaj video i snađi se“.</h2></div><div className="academy-loop__steps">{["Pogledaj lekciju", "Razumi zašto", "Složi rutinu", "Prati napredak"].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}</div></section>
    </div>
    </MemberGate>
  );
}
