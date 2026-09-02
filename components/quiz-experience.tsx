"use client";

/* eslint-disable @next/next/no-img-element -- checked-in Academy photography is used in the personalized result. */

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LockKeyhole, RefreshCw, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { products, productById, quizQuestions, recommendRoutine, routines } from "@/lib/data/catalog";
import { courses } from "@/lib/data";
import { ProductPhoto } from "./product-photo";
import { useCommerce } from "./commerce-store";
import { toCommerceProduct } from "@/lib/ui";
import { useLearning } from "./learning-store";
import { useMember } from "./member-store";

export function QuizExperience() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const { addToRoutine, addToCart } = useCommerce();
  const { saveBlueprint } = useLearning();
  const { member } = useMember();
  const question = quizQuestions[step];
  const selected = answers[step];
  const recommendation = useMemo(() => recommendRoutine(answers), [answers]);
  const routine = routines.find((candidate) => candidate.id === recommendation.routineId) ?? routines[0];
  const recommendedItems = [...routine.morning, ...routine.evening]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.productId === item.productId) === index)
    .filter((item) => !recommendation.excludedProductIds.includes(item.productId))
    .slice(0, 4);
  const primaryGoalQuestion = quizQuestions.find((item) => item.id === "primary-goal");
  const primaryGoalAnswer = primaryGoalQuestion?.answers.find((answer) => answers.includes(answer.id));
  const recommendedCourse = routine.id === "age-support" ? courses[1] : ["mirna-barijera", "duboka-hidratacija"].includes(routine.id) ? courses[0] : courses[2];

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
      const response = await fetch("/api/routines", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId, name: routine.name, skinProfile: { answers, recommendation: routine.id }, items: routineProducts }) });
      if (!response.ok) throw new Error("save failed");
      await saveBlueprint({ routineId: routine.id, routineName: routine.name, primarySignal: primaryGoalAnswer?.label ?? "Balans i stabilnost", answerIds: answers });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function addRoutineToCart() {
    recommendedItems.forEach((item) => addToCart(toCommerceProduct(productById[item.productId])));
  }

  function reset() { setAnswers([]); setStep(0); setFinished(false); setStarted(false); setSaveState("idle"); }

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
        {!started ? (
          <div className="quiz-intro">
            <div className="quiz-intro__signal"><span>skin</span><strong>09</strong><small>signala</small></div>
            <p className="eyebrow">EQUA Skin Blueprint</p>
            <h1>Ne tražimo tvoj „tip“. Tražimo <em>kontekst.</em></h1>
            <p>Za oko tri minuta povezujemo stanje kože, cilj, trenutne aktive, toleranciju, budžet i realan broj koraka.</p>
            <div className="quiz-intro__benefits"><span><CheckCircle2 /> Objašnjen AM/PM plan</span><span><ShieldCheck /> Safety i conflict guard</span><span><Sparkles /> Kurs i rutina po rezultatu</span></div>
            <button className="button button--dark" type="button" onClick={() => setStarted(true)}>Počni Skin Check <ArrowRight size={17} /></button>
            <small>Ovo nije medicinska dijagnoza. Rezultat služi edukaciji i bezbednijem izboru kozmetike.</small>
          </div>
        ) : !finished ? (
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
            <div className="quiz-result__header"><div><p className="eyebrow">Tvoj Skin Blueprint</p><h1>{routine.name}</h1><p>{routine.description}</p></div><div className="quiz-result__score"><div><strong>{Math.min(98, 82 + Math.max(...Object.values(recommendation.scores)))}</strong><span>% signal fit</span></div></div></div>
            <div className="skin-fingerprint"><div><span>Glavni signal</span><strong>{primaryGoalAnswer?.label ?? "Balans i stabilnost"}</strong></div><div><span>Tolerancija</span><strong>{answers.includes("sensitivity-high") ? "Niska · uvodi polako" : "Stabilna"}</strong></div><div><span>Ritam</span><strong>{answers.includes("length-three") ? "Minimalan · 3 koraka" : "Strukturiran · 4 koraka"}</strong></div></div>
            <div className="quiz-result__routine">
              {recommendedItems.map((item, index) => { const product = products.find((candidate) => candidate.id === item.productId)!; return <article key={item.productId}><span>0{index + 1} · {item.note}</span><div className="quiz-product-photo"><ProductPhoto product={product} /></div><h3>{product.name}</h3><Link className="text-link" href={`/product/${product.slug}`}>Detalji <ArrowRight size={13} /></Link></article>; })}
            </div>
            <div className="quiz-plan"><div><span>01</span><p><strong>Prva nedelja</strong>Stabilizuj osnovu i uvedi samo hidrataciju + SPF.</p></div><div><span>02</span><p><strong>Druga nedelja</strong>Dodaj jedan ciljani serum svako drugo veče.</p></div><div><span>03</span><p><strong>Nedelje 3–4</strong>Prati signal i menjaj samo jednu stvar.</p></div></div>
            {recommendation.safetyMessages.map((message) => <div className="concern-tip" key={message}>{message}</div>)}
            <div className="quiz-course-match"><div className="quiz-course-match__image"><img src={recommendedCourse.image} alt="" width={900} height={600} /></div><div><p className="eyebrow">Kurs preporučen uz ovaj rezultat</p><h2>{recommendedCourse.title}</h2><p>{recommendedCourse.description}</p><small>{recommendedCourse.priceRsd === 0 ? "Uključen besplatno" : `${recommendedCourse.priceRsd.toLocaleString("sr-RS")} RSD`} · {recommendedCourse.level}</small></div><Link className="button button--ghost" href={member ? `/academy/${recommendedCourse.slug}` : `/join?returnTo=${encodeURIComponent(`/academy/${recommendedCourse.slug}`)}`}>{member ? "Otvori program" : <><LockKeyhole size={15} /> Registruj se i otključaj</>} <ArrowRight size={15} /></Link></div>
            {saveState === "error" && <p className="quiz-save-error" role="alert">Nije sačuvano. Proveri vezu i pokušaj ponovo.</p>}
            <div className="quiz-controls"><button className="button button--ghost" onClick={reset}><RefreshCw size={16} /> Ponovi</button><button className="button button--ghost" onClick={addRoutineToCart}><ShoppingBag size={16} /> Dodaj sve u korpu</button><button className="button button--dark" onClick={saveRoutine} disabled={saveState === "saving" || saveState === "saved"}><Sparkles size={16} /> {saveState === "idle" || saveState === "error" ? "Sačuvaj Blueprint" : saveState === "saving" ? "Čuvamo…" : "Sačuvano"}</button></div>
          </div>
        )}
      </section>
    </div>
  );
}
