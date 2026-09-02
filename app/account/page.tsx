"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Heart, LoaderCircle, MessageCircle, PackageCheck, Play, Sparkles, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCommerce } from "@/components/commerce-store";
import { useLearning } from "@/components/learning-store";
import { CourseProgress } from "@/components/course-progress";
import { courses } from "@/lib/data";
import { useMember } from "@/components/member-store";

type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  itemCount: number;
  totalCents: number;
  currency: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  pending: "Primljena",
  confirmed: "Potvrđena",
  processing: "Priprema se",
  shipped: "Poslata",
  complete: "Isporučena",
  cancelled: "Otkazana",
};

function formatMoney(minorUnits: number, currency: string) {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}

export default function AccountPage() {
  const { cartCount, routine, wishlist } = useCommerce();
  const { enrolledCourseIds, completedLessonIds, skinBlueprint } = useLearning();
  const { member } = useMember();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function findOrders(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const orderNumber = String(form.get("orderNumber") ?? "").trim();

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(orderNumber)}&limit=20`);
      const payload = (await response.json()) as {
        ok: boolean;
        orders?: OrderSummary[];
        error?: { message?: string };
      };
      if (!response.ok) throw new Error(payload.error?.message || "Porudžbine nisu dostupne.");
      setOrders(payload.orders ?? []);
      setSearched(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Pokušaj ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="page-hero page-hero--split">
        <div>
          <p className="eyebrow">Tvoj prostor</p>
          <h1 className="page-title">Moj EQUA.</h1>
        </div>
        <p>Jedan prostor za profil kože, video programe, rutinu, kupovine i razgovore iz EQUA Club zajednice.</p>
      </section>

      <div className="account-grid">
        <aside className="account-card account-profile">
          <UserRound size={34} aria-hidden="true" />
          <p className="eyebrow">{member ? `EQUA član · ${member.name}` : "Gost profil"}</p>
          <h2>Tvoja nega ima memoriju.</h2>
          <p>{member ? `${member.email} · Skin Blueprint, kursevi, rutina i kupovine povezani su u jednom prikazu.` : "Registruj se da otključaš Akademiju i EQUA Club i povežeš Skin Blueprint sa svojim profilom."}</p>
          <Link className="text-link" href={member ? "/quiz" : "/join?returnTo=%2Faccount"}>{member ? "Osveži skin check" : "Registruj članstvo"} <ArrowRight size={16} /></Link>
          <nav className="account-quick-nav" aria-label="Moj EQUA prečice"><Link href="/academy"><BookOpen /> Moji programi</Link><Link href="/routine"><Sparkles /> Moja rutina</Link><Link href="/community"><MessageCircle /> Moje diskusije</Link></nav>
        </aside>

        <div>
          <div className="account-stat-grid">
            <article className="account-stat">
              <Sparkles size={20} aria-hidden="true" />
              <div><strong>{routine.length}</strong><br /><small>koraka u rutini</small></div>
            </article>
            <article className="account-stat">
              <Heart size={20} aria-hidden="true" />
              <div><strong>{wishlist.length}</strong><br /><small>sačuvanih proizvoda</small></div>
            </article>
            <article className="account-stat">
              <PackageCheck size={20} aria-hidden="true" />
              <div><strong>{cartCount}</strong><br /><small>proizvoda u korpi</small></div>
            </article>
            <article className="account-stat">
              <BookOpen size={20} aria-hidden="true" />
              <div><strong>{completedLessonIds.length}</strong><br /><small>završenih lekcija</small></div>
            </article>
          </div>

          <section className="account-card account-blueprint" style={{ marginTop: 12 }}>
            <div><p className="eyebrow">Skin Blueprint</p><h2>{skinBlueprint?.routineName ?? "Tvoj profil čeka Skin Check."}</h2><p>{skinBlueprint?.primarySignal ?? "Odgovori na nekoliko pitanja i dobićeš objašnjen 30-dnevni plan, ne samo listu proizvoda."}</p></div>
            <Link className="button button--ghost" href="/quiz">{skinBlueprint ? "Osveži rezultat" : "Pokreni Skin Check"} <ArrowRight size={16} /></Link>
          </section>

          <section className="account-card" style={{ marginTop: 12 }}>
            <div className="account-section-head"><div><p className="eyebrow">Moja Akademija</p><h2>Nastavi gde si stao/la.</h2></div><Link className="text-link" href="/academy">Svi programi <ArrowRight size={14} /></Link></div>
            <div className="account-courses">{courses.filter((course) => enrolledCourseIds.includes(course.id)).length ? courses.filter((course) => enrolledCourseIds.includes(course.id)).map((course) => <article key={course.id}><div><span>{course.eyebrow}</span><h3>{course.title}</h3></div><CourseProgress course={course} /><Link className="button button--dark" href={`/academy/${course.slug}`}><Play size={15} /> Nastavi</Link></article>) : <div className="account-empty"><BookOpen /><div><strong>Još nema upisanih programa.</strong><p>Skin Barrier Reset je besplatan i spreman za početak.</p></div><Link className="button button--dark" href="/academy/skin-barrier-reset">Upiši program</Link></div>}</div>
          </section>

          <section className="account-card" style={{ marginTop: 12 }}>
            <p className="eyebrow">Porudžbine</p>
            <h2>Pronađi prethodne kupovine</h2>
            <p>Za bezbedan guest pregled unesi email i broj konkretne porudžbine. Prijavljeni nalog ih povezuje automatski.</p>
            <form className="checkout-form" onSubmit={findOrders}>
              <div className="form-field form-field--full">
                <label htmlFor="account-email">Email adresa</label>
                <input id="account-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="form-field form-field--full">
                <label htmlFor="account-order">Broj porudžbine</label>
                <input id="account-order" name="orderNumber" placeholder="ZK-20260902-XXXXXXXX" autoCapitalize="characters" required />
              </div>
              {error && <p className="form-field--full" role="alert">{error}</p>}
              <button className="button button--dark form-field--full" type="submit" disabled={loading}>
                {loading && <LoaderCircle size={17} aria-hidden="true" />}
                {loading ? "Tražimo…" : "Prikaži porudžbine"}
              </button>
            </form>

            {searched && orders.length === 0 && <p>Nema pronađenih porudžbina za ovu adresu.</p>}
            {orders.length > 0 && (
              <div className="admin-table">
                <table>
                  <thead><tr><th>Broj</th><th>Status</th><th>Stavke</th><th>Ukupno</th></tr></thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.orderNumber}</strong></td>
                        <td>{statusLabels[order.status] ?? order.status}</td>
                        <td>{order.itemCount}</td>
                        <td>{formatMoney(order.totalCents, order.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
