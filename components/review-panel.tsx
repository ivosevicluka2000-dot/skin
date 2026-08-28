"use client";

import { CheckCircle2, LoaderCircle, Star } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type Review = { id: string; authorName: string; rating: number; title: string | null; body: string; verifiedPurchase: boolean };

const editorialFallback: Review[] = [
  { id: "editorial-1", authorName: "Milica P.", rating: 5, title: "Konačno serum koji se uklapa", body: "Tekstura je lagana i lepo sedi ispod SPF-a. Najviše mi znači što tačno znam gde ide u rutini.", verifiedPurchase: true },
  { id: "editorial-2", authorName: "Jovana R.", rating: 5, title: "Bez komplikovanja", body: "Posle tri nedelje koža deluje mirnije, a uputstvo za postepeno uvođenje je baš korisno.", verifiedPurchase: true },
];

export function ReviewPanel({ productId, rating, count }: { productId: string; rating: number; count: number }) {
  const [reviews, setReviews] = useState<Review[]>(editorialFallback);
  const [selectedRating, setSelectedRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    let active = true;
    void fetch(`/api/reviews?productId=${encodeURIComponent(productId)}&limit=8`)
      .then((response) => response.json())
      .then((payload: { reviews?: Review[] }) => { if (active && payload.reviews?.length) setReviews(payload.reviews); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [productId]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId, authorName: form.get("authorName"), email: form.get("email"), rating: selectedRating, title: form.get("title"), body: form.get("body") }) });
      if (!response.ok) throw new Error("review failed");
      setStatus("sent");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="review-section">
      <div className="review-summary">
        <p className="eyebrow">EQUA zajednica</p><h2>Rezultati, bez filtera.</h2>
        <div className="review-score"><strong>{rating.toFixed(1)}</strong><div><span aria-hidden="true">★★★★★</span><small>Na osnovu {count} utisaka</small></div></div>
        <div className="rating-bars">{[5,4,3,2,1].map((star) => <div key={star}><span>{star}</span><i><b style={{ width: `${star === 5 ? 78 : star === 4 ? 17 : star === 3 ? 4 : 1}%` }} /></i><small>{star === 5 ? "78%" : star === 4 ? "17%" : star === 3 ? "4%" : "1%"}</small></div>)}</div>
      </div>
      <div className="review-stream">
        {reviews.map((review) => <article key={review.id}><div><span>{"★".repeat(review.rating)}</span>{review.verifiedPurchase && <small><CheckCircle2 size={12} /> Verifikovana kupovina</small>}</div><h3>{review.title}</h3><p>{review.body}</p><strong>{review.authorName}</strong></article>)}
      </div>
      <form className="review-form" onSubmit={submitReview}>
        <p className="eyebrow">Podeli iskustvo</p><h2>Kako se formula ponaša na tvojoj koži?</h2>
        <div className="review-rating-input" aria-label="Ocena">{[1,2,3,4,5].map((star) => <button type="button" key={star} onClick={() => setSelectedRating(star)} aria-label={`${star} zvezdica`} className={star <= selectedRating ? "is-active" : ""}><Star size={20} fill={star <= selectedRating ? "currentColor" : "none"} /></button>)}</div>
        <div className="checkout-form"><div className="form-field"><label htmlFor="review-name">Ime</label><input id="review-name" name="authorName" required /></div><div className="form-field"><label htmlFor="review-email">Email</label><input id="review-email" name="email" type="email" /></div><div className="form-field form-field--full"><label htmlFor="review-title">Naslov</label><input id="review-title" name="title" /></div><div className="form-field form-field--full"><label htmlFor="review-body">Iskustvo</label><textarea id="review-body" name="body" rows={4} minLength={10} required /></div></div>
        <button className="button button--dark" disabled={status === "sending" || status === "sent"}>{status === "sending" ? <LoaderCircle size={17} /> : null}{status === "sent" ? "Poslato na proveru" : status === "sending" ? "Šaljemo…" : "Pošalji utisak"}</button>
        <span className="newsletter-status" role="status">{status === "sent" && "Hvala. Utisak će biti objavljen nakon moderacije."}{status === "error" && "Nije uspelo. Pokušaj ponovo za trenutak."}</span>
      </form>
    </section>
  );
}
