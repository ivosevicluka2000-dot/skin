"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useCommerce, type RoutineLine } from "./commerce-store";
import { ProductArt } from "./product-art";

function RoutineTrack({ title, lines, onRemove }: { title: string; lines: RoutineLine[]; onRemove: (slug: string) => void }) {
  return (
    <section className="routine-track">
      <div className="routine-track__head"><h2>{title}</h2><span>{lines.length} koraka</span></div>
      <div className="routine-slots">
        {[0, 1, 2, 3].map((index) => { const line = lines[index]; return <article className="routine-slot" key={`${title}-${index}`}><span>0{index + 1}</span>{line ? <><ProductArt color={line.product.color} label={line.product.brand} compact /><strong>{line.product.name}</strong><small>{line.product.routineStep}</small><button onClick={() => onRemove(line.product.slug)}>Ukloni</button></> : <><div className="routine-empty-orb" /><strong>Slobodan korak</strong><small>Dodaj iz prodavnice</small></>}</article>; })}
      </div>
    </section>
  );
}

export function RoutineBuilder() {
  const { routine, removeFromRoutine, addToCart } = useCommerce();
  const morning = routine.filter((line) => line.slot === "AM" || line.slot === "AM + PM");
  const evening = routine.filter((line) => line.slot === "PM" || line.slot === "AM + PM");
  const subtotal = routine.reduce((sum, line) => sum + line.product.price, 0);
  const format = (value: number) => new Intl.NumberFormat("sr-Latn-RS").format(value) + " RSD";

  return (
    <div className="routine-page">
      <header className="page-hero page-hero--split"><div><p className="eyebrow">Tvoja polica, bez viška</p><h1 className="page-title">Rutina koja prati tvoj ritam.</h1></div><p>Dodaj, skloni i poređaj proizvode. AM i PM pregled ti odmah pokazuje gde imaš duplikate ili rupu.</p></header>
      {routine.length === 0 ? <section className="checkout-success"><div><span><Sparkles size={36} /></span><h2>Polica je prazna.</h2><p>Najbrže je da skin check složi prvu verziju tvoje rutine.</p><Link className="button button--dark" href="/quiz">Pokreni skin check <ArrowRight size={17} /></Link></div></section> : <div className="routine-builder"><div className="routine-board"><RoutineTrack title="Jutro · AM" lines={morning} onRemove={removeFromRoutine} /><RoutineTrack title="Veče · PM" lines={evening} onRemove={removeFromRoutine} /></div><aside className="routine-summary"><p className="eyebrow">Pregled police</p><h2>{routine.length} pametna koraka</h2><div className="routine-summary__row"><span>Proizvodi</span><strong>{routine.length}</strong></div><div className="routine-summary__row"><span>Ukupno</span><strong>{format(subtotal)}</strong></div><button className="button button--acid button--full" onClick={() => routine.forEach((line) => addToCart(line.product))}><ShoppingBag size={17} /> Dodaj rutinu u korpu</button><Link className="button button--light button--full" href="/shop">Dodaj još proizvoda</Link></aside></div>}
    </div>
  );
}
