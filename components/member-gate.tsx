"use client";

/* eslint-disable @next/next/no-img-element -- checked-in EQUA campaign photography is part of the gate composition. */

import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
import { type ReactNode } from "react";
import { useMember } from "./member-store";

export function MemberGate({ children, returnTo, area }: { children: ReactNode; returnTo: string; area: "academy" | "community" }) {
  const { member, checking } = useMember();
  if (member) return <>{children}</>;

  const isAcademy = area === "academy";
  return (
    <section className="member-gate" aria-busy={checking}>
      <div className="member-gate__visual">
        <img src="/images/campaign/equa-ritual-hero.jpg" alt="EQUA ritual nege kože" width={1800} height={1126} />
        <div className="member-gate__shade" />
        <div className="member-gate__badge"><LockKeyhole /><span><strong>Samo za članove</strong>Jedan nalog · sav sadržaj i napredak</span></div>
      </div>
      <div className="member-gate__copy">
        <span className="member-gate__icon">{isAcademy ? <BookOpen /> : <MessageCircle />}</span>
        <p className="eyebrow">EQUA članstvo</p>
        <h1>{isAcademy ? "Akademija pamti gde si stao/la." : "Bolji razgovor počinje sigurnim prostorom."}</h1>
        <p>{isAcademy ? "Registruj se da otključaš programe, sačuvaš Skin Blueprint i nastaviš lekciju na istom mestu." : "EQUA Club je zatvoren prostor za članove, pitanja uz kurseve i stručno moderirane razgovore."}</p>
        <div className="member-gate__benefits"><span><ShieldCheck /> Besplatna registracija za MVP</span><span><LockKeyhole /> Academy i Club nisu javni</span></div>
        <Link className="button button--dark" href={`/join?returnTo=${encodeURIComponent(returnTo)}`}>{checking ? "Proveravamo članstvo…" : "Registruj se ili prijavi"} <ArrowRight /></Link>
        <Link className="text-link" href="/">Vrati se na početnu</Link>
      </div>
    </section>
  );
}
