"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, LockKeyhole, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, type FormEvent } from "react";
import { useMember } from "./member-store";

export function MemberJoinExperience({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const { member, checking, register } = useMember();

  useEffect(() => {
    if (!checking && member) router.replace(returnTo);
  }, [checking, member, returnTo, router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    register({ name: String(form.get("name") ?? ""), email: String(form.get("email") ?? "") });
    router.push(returnTo);
  }

  return (
    <div className="join-page">
      <section className="join-panel join-panel--brand">
        <Link className="wordmark wordmark--light" href="/">EQUA<span>°</span></Link>
        <div><p className="eyebrow">Jedan nalog · ceo ritual</p><h1>Tvoja koža ima priču. Sada ima i <em>memoriju.</em></h1><p>Skin Check, preporučeni kurs, sačuvana rutina, kupovine i razgovori — na jednom mestu.</p></div>
        <div className="join-benefits"><span><Sparkles /><strong>Skin Blueprint</strong>Personalizovan plan posle kviza</span><span><BookOpen /><strong>Akademija</strong>Lekcije i napredak</span><span><MessageCircle /><strong>EQUA Club</strong>Zatvorena zajednica</span></div>
      </section>
      <section className="join-panel join-panel--form">
        <Link className="join-back" href="/"><ArrowLeft /> Nazad</Link>
        <div className="join-form-wrap"><span className="join-lock"><LockKeyhole /></span><p className="eyebrow">Registracija člana</p><h2>Dobro došao/la u EQUA.</h2><p>Za ovu MVP verziju dovoljno je da napraviš članstvo na uređaju.</p>
          <form onSubmit={submit}>
            <label>Ime i prezime<input name="name" autoComplete="name" placeholder="Ana Jovanović" required minLength={2} /></label>
            <label>Email adresa<input name="email" type="email" autoComplete="email" placeholder="ana@email.rs" required /></label>
            <label className="join-consent"><input name="terms" type="checkbox" required /><span>Prihvatam uslove korišćenja naloga. Marketing saglasnost ostaje odvojena.</span></label>
            <button className="button button--dark button--full" type="submit">Napravi članstvo <ArrowRight /></button>
          </form>
          <small>Članstvo se u ovoj MVP verziji bezbedno čuva samo na ovom uređaju.</small>
        </div>
      </section>
    </div>
  );
}
