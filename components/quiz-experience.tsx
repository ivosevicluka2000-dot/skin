"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RefreshCw, Sparkles } from "lucide-react";
import { products, productById, quizQuestions, recommendRoutine, routines } from "@/lib/data/catalog";
import { ProductArt } from "./product-art";
import { useCommerce } from "./commerce-store";
import { productColor, productShape, toCommerceProduct } from "@/lib/ui";

export function QuizExperience() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const { addToRoutine } = useCommerce();
  const question = quizQuestions[step];
  const selected = answers[step];
  const recommendation = useMemo(() => recommendRoutine(answers), [answers]);
  const routine = routines.find((candidate) => candidate.id === recommendation.routineId) ?? routines[0];
  const recommendedItems = [...routine.morning, ...routine.evening]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.productId === item.productId) === index)
    .filter((item) => !recommendation.excludedProductIds.includes(item.productId))
    .slice(0, 4);

  function select(answerId: string) {
    setAnswers((current) => current.map((value, index) => index === step ? answerId : value).concat(current.length <= step ? [answerId] : []));
  }

  function next() {
    if (!selected) return;
    if (step === quizQuestions.length - 1) setFinished(true);
    else setStep((current) => current + 1);
  }

  async function saveRoutine() {
    setSaveState("saving");
    const routineProducts = recommendedItems.map((item) => {
      const product = productById[item.productId];
      const inMorning = routine.morning.some((candidate) => candidate.productId === item.productId);
      const inEvening = routine.evening.some((candidate) => candidate.productId === item.productId);
      const slot = inMorning && inEvening ? "AM + PM" : inMorning ? "AM" : "PM";
      addToRoutine(toCommerceProduct(product), slot);
      return { productId: product.id, productName: product.name, slot, quantity: 1, unitPriceCents: product.priceRsd * 100 };
    });
    try {
      const sessionId = window.localStorage.getItem("equa-session") ?? crypto.randomUUID();
      window.localStorage.setItem("equa-session", sessionId);
      await fetch("/api/routines", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId, name: routine.name, skinProfile: { answers, recommendation: routine.id }, items: routineProducts }) });
    } finally {
      setSaveState("saved");
    }
  }

  function reset() { setAnswers([]); setStep(0); setFinished(false); setSaveState("idle"); }

  return (
    <div className="quiz-page">
      <aside className="quiz-sidebar">
        <div><span className="wordmark wordmark--light">EQUA°</span><p className="eyebrow" style={{ marginTop: 40 }}>Skin check</p></div>
        <div className="quiz-sidebar__steps" aria-label={`Korak ${finished ? quizQuestions.length : step + 1} od ${quizQuestions.length}`}>
          {quizQuestions.map((item, index) => <span key={item.id} className={index <= step || finished ? "is-done" : ""} />)}
        </div>
        <p>Ovo nije medicinska dijagnoza. Kod upornih promena konsultuj dermatologa.</p>
      </aside>
      <section className="quiz-stage">
        {!finished ? (
          <div className="quiz-card">
            <div className="quiz-progress">Pitanje {step + 1} / {quizQuestions.length}</div>
            <h1>{question.title}</h1><p>{question.helper}</p>
            <div className="quiz-options">
              {question.answers.map((answer) => <button key={answer.id} className={`quiz-option ${selected === answer.id ? "is-selected" : ""}`} onClick={() => select(answer.id)}><div><strong>{answer.label}</strong>{answer.description && <span>{answer.description}</span>}</div>{selected === answer.id && <Check size={19} />}</button>)}
            </div>
            <div className="quiz-controls"><button className="button button--ghost" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft size={16} /> Nazad</button><button className="button button--dark" onClick={next} disabled={!selected}>{step === quizQuestions.length - 1 ? "Vidi rutinu" : "Sledeće"} <ArrowRight size={16} /></button></div>
          </div>
        ) : (
          <div className="quiz-result">
            <div className="quiz-result__header"><div><p className="eyebrow">Tvoj rezultat</p><h1>{routine.name}</h1><p>{routine.description}</p></div><div className="quiz-result__score"><div><strong>{Math.min(98, 82 + Math.max(...Object.values(recommendation.scores)))}</strong><span>% podudaranje</span></div></div></div>
            <div className="quiz-result__routine">
              {recommendedItems.map((item, index) => { const product = products.find((candidate) => candidate.id === item.productId)!; return <article key={item.productId}><span>0{index + 1} · {item.note}</span><ProductArt color={productColor(product)} label={product.name} shape={productShape(product)} /><h3>{product.name}</h3><Link className="text-link" href={`/product/${product.slug}`}>Detalji <ArrowRight size={13} /></Link></article>; })}
            </div>
            {recommendation.safetyMessages.map((message) => <div className="concern-tip" key={message}>{message}</div>)}
            <div className="quiz-controls"><button className="button button--ghost" onClick={reset}><RefreshCw size={16} /> Ponovi</button><button className="button button--dark" onClick={saveRoutine} disabled={saveState !== "idle"}><Sparkles size={16} /> {saveState === "idle" ? "Sačuvaj moju rutinu" : saveState === "saving" ? "Čuvamo…" : "Sačuvano"}</button></div>
          </div>
        )}
      </section>
    </div>
  );
}
