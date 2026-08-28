"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useCommerce } from "@/components/commerce-store";
import { ProductArt } from "@/components/product-art";

type CreatedOrder = { id: string; orderNumber: string; totalCents: number; currency: string };
type OrderResponse = { ok: boolean; order?: CreatedOrder; error?: { message?: string } };
type CheckoutStep = 0 | 1 | 2;

function formatRsd(value: number) {
  return new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(value);
}

export default function CartPage() {
  const { cart, subtotal, setQuantity, removeFromCart } = useCommerce();
  const [step, setStep] = useState<CheckoutStep>(0);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const shipping = subtotal >= 6_000 ? 0 : 390;
  const total = subtotal + shipping;
  const freeShippingGap = Math.max(0, 6_000 - subtotal);

  function moveTo(next: CheckoutStep) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continueToPayment() {
    if (!formRef.current?.reportValidity()) return;
    moveTo(2);
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0 || submitting || !accepted) return;
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { email: form.get("email"), firstName: form.get("firstName"), lastName: form.get("lastName"), phone: form.get("phone") },
          shippingAddress: { addressLine1: form.get("addressLine1"), addressLine2: form.get("addressLine2"), city: form.get("city"), postalCode: form.get("postalCode"), country: "RS" },
          paymentMethod,
          notes: form.get("notes"),
          currency: "RSD",
          shippingCents: shipping * 100,
          items: cart.map(({ product, quantity }) => ({ productId: product.id, productName: product.name, variantName: product.brand, routineSlot: product.routineStep, quantity, unitPriceCents: product.price * 100 })),
        }),
      });
      const payload = (await response.json()) as OrderResponse;
      if (!response.ok || !payload.order) throw new Error(payload.error?.message || "Porudžbina trenutno ne može da se sačuva.");
      setCreatedOrder(payload.order);
      cart.forEach(({ product }) => setQuantity(product.slug, 0));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Došlo je do greške. Pokušaj ponovo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (createdOrder) {
    return <section className="checkout-success checkout-success--premium"><div><span aria-hidden="true"><Check size={42} /></span><p className="eyebrow">Porudžbina je potvrđena</p><h1>Rutina je na putu.</h1><p>Broj porudžbine <strong>{createdOrder.orderNumber}</strong> · ukupno {formatRsd(createdOrder.totalCents / 100)}.</p><div className="order-timeline"><div className="is-active"><CheckCircle2 /><strong>Primljena</strong></div><i /><div><PackageCheck /><strong>Pakovanje</strong></div><i /><div><Truck /><strong>Dostava</strong></div></div><Link className="button button--dark" href="/account">Prati porudžbinu <ArrowRight size={17} /></Link></div></section>;
  }

  if (cart.length === 0) {
    return <section className="checkout-success"><div><span aria-hidden="true"><ShoppingBag size={38} /></span><p className="eyebrow">Tvoja korpa</p><h1>Ovde još nema proizvoda.</h1><p>Dodaj proizvod ili složi kompletnu rutinu uz skin check.</p><Link className="button button--dark" href="/shop"><ArrowLeft size={18} /> Nazad u prodavnicu</Link></div></section>;
  }

  return (
    <div className="checkout-page">
      <header className="checkout-head">
        <div><Link className="wordmark" href="/">EQUA<span>°</span></Link><span className="checkout-secure"><LockKeyhole size={14} /> Sigurna naplata</span></div>
        <nav className="checkout-steps" aria-label="Koraci kupovine">
          {["Korpa", "Dostava", "Plaćanje"].map((label, index) => <button key={label} type="button" className={`${step === index ? "is-active" : ""} ${step > index ? "is-done" : ""}`} onClick={() => index < step && moveTo(index as CheckoutStep)}><span>{step > index ? <Check size={13} /> : index + 1}</span>{label}</button>)}
        </nav>
        <Link href="/shop">Nastavi kupovinu</Link>
      </header>

      <form ref={formRef} className="checkout-flow" onSubmit={submitOrder}>
        <section className="checkout-flow__main">
          <div className="checkout-panel" hidden={step !== 0}>
            <p className="eyebrow">01 · Pregled korpe</p><h1>Spremno za tvoj ritual.</h1>
            <div className="shipping-meter"><div><span>{freeShippingGap ? `Još ${formatRsd(freeShippingGap)} do besplatne dostave` : "Besplatna dostava je aktivirana"}</span><strong>{Math.min(100, Math.round(subtotal / 60))}%</strong></div><i><b style={{ width: `${Math.min(100, subtotal / 60)}%` }} /></i></div>
            <div className="checkout-products">
              {cart.map(({ product, quantity }) => <article className="checkout-product" key={product.slug}><ProductArt color={product.color} label={product.brand} compact /><div><span>{product.brand} · {product.routineStep}</span><h2>{product.name}</h2><strong>{formatRsd(product.price)}</strong></div><div className="checkout-product__actions"><div className="quantity-control"><button type="button" onClick={() => setQuantity(product.slug, quantity - 1)} aria-label="Smanji količinu"><Minus size={13} /></button><b>{quantity}</b><button type="button" onClick={() => setQuantity(product.slug, quantity + 1)} aria-label="Povećaj količinu"><Plus size={13} /></button></div><button type="button" className="line-remove" onClick={() => removeFromCart(product.slug)} aria-label={`Ukloni ${product.name}`}><X size={16} /></button></div></article>)}
            </div>
            <div className="checkout-perks"><div><Truck /><span><strong>Dostava 1–3 dana</strong>Beograd i cela Srbija</span></div><div><ShieldCheck /><span><strong>Proveren izbor</strong>Bez nasumičnih formula</span></div></div>
            <button className="button button--dark button--full checkout-next" type="button" onClick={() => moveTo(1)}>Nastavi na dostavu <ArrowRight size={17} /></button>
          </div>

          <div className="checkout-panel" hidden={step !== 1}>
            <p className="eyebrow">02 · Kontakt i dostava</p><h1>Gde šaljemo tvoju rutinu?</h1>
            <div className="checkout-form checkout-form--premium">
              <div className="form-field"><label htmlFor="firstName">Ime</label><input id="firstName" name="firstName" autoComplete="given-name" placeholder="Ana" required /></div>
              <div className="form-field"><label htmlFor="lastName">Prezime</label><input id="lastName" name="lastName" autoComplete="family-name" placeholder="Jovanović" required /></div>
              <div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="ana@email.rs" required /></div>
              <div className="form-field"><label htmlFor="phone">Telefon</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+381 60 000 000" /></div>
              <div className="form-field form-field--full"><label htmlFor="addressLine1">Ulica i broj</label><input id="addressLine1" name="addressLine1" autoComplete="address-line1" placeholder="Kneza Miloša 12" required /></div>
              <div className="form-field form-field--full"><label htmlFor="addressLine2">Stan, sprat ili ulaz</label><input id="addressLine2" name="addressLine2" autoComplete="address-line2" placeholder="Stan 8, III sprat" /></div>
              <div className="form-field"><label htmlFor="city">Grad</label><input id="city" name="city" autoComplete="address-level2" placeholder="Beograd" required /></div>
              <div className="form-field"><label htmlFor="postalCode">Poštanski broj</label><input id="postalCode" name="postalCode" inputMode="numeric" autoComplete="postal-code" placeholder="11000" required /></div>
              <div className="form-field form-field--full"><label htmlFor="notes">Napomena kuriru</label><textarea id="notes" name="notes" rows={3} placeholder="Opcionalno" /></div>
            </div>
            <div className="checkout-nav"><button className="button button--ghost" type="button" onClick={() => moveTo(0)}><ArrowLeft size={16} /> Korpa</button><button className="button button--dark" type="button" onClick={continueToPayment}>Nastavi na plaćanje <ArrowRight size={16} /></button></div>
          </div>

          <div className="checkout-panel" hidden={step !== 2}>
            <p className="eyebrow">03 · Plaćanje</p><h1>Poslednji korak. Bez iznenađenja.</h1>
            <div className="payment-options">
              <label className={paymentMethod === "cash_on_delivery" ? "is-selected" : ""}><input type="radio" name="paymentMethod" value="cash_on_delivery" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} /><span><Truck /><strong>Pouzećem</strong><small>Plaćaš kuriru pri preuzimanju</small></span><CheckCircle2 /></label>
              <label className={paymentMethod === "demo_card" ? "is-selected" : ""}><input type="radio" name="paymentMethod" value="demo_card" checked={paymentMethod === "demo_card"} onChange={() => setPaymentMethod("demo_card")} /><span><CreditCard /><strong>Kartica · demo</strong><small>Simulacija bez stvarne naplate</small></span><CheckCircle2 /></label>
            </div>
            {paymentMethod === "demo_card" && <div className="demo-card-fields"><div className="form-field form-field--full"><label htmlFor="cardNumber">Broj kartice</label><input id="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" required /></div><div className="form-field"><label htmlFor="cardExpiry">Važi do</label><input id="cardExpiry" placeholder="12 / 29" required /></div><div className="form-field"><label htmlFor="cardCvc">CVC</label><input id="cardCvc" inputMode="numeric" placeholder="123" required /></div><p><ShieldCheck size={15} /> Demo polja se ne čuvaju i ne šalju serveru.</p></div>}
            <label className="checkout-consent"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>Potvrđujem podatke i prihvatam uslove demo porudžbine.</span></label>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <div className="checkout-nav"><button className="button button--ghost" type="button" onClick={() => moveTo(1)}><ArrowLeft size={16} /> Dostava</button><button className="button button--dark" type="submit" disabled={submitting || !accepted}>{submitting ? <LoaderCircle size={18} /> : <LockKeyhole size={18} />}{submitting ? "Čuvamo porudžbinu…" : `Potvrdi · ${formatRsd(total)}`}</button></div>
          </div>
        </section>

        <aside className="checkout-summary checkout-summary--premium" aria-label="Pregled porudžbine">
          <div className="checkout-summary__top"><span>Sažetak</span><strong>{cart.reduce((sum, line) => sum + line.quantity, 0)} proizvoda</strong></div>
          {cart.map(({ product, quantity }) => <div className="checkout-summary__line" key={product.slug}><div><strong>{product.name}</strong><br /><small>{quantity} × {formatRsd(product.price)}</small></div><strong>{formatRsd(product.price * quantity)}</strong></div>)}
          <div className="checkout-summary__totals"><div><span>Međuzbir</span><strong>{formatRsd(subtotal)}</strong></div><div><span>Dostava</span><strong>{shipping === 0 ? "Besplatno" : formatRsd(shipping)}</strong></div><div><span>Ukupno</span><strong>{formatRsd(total)}</strong></div></div>
          <div className="checkout-promise"><ShieldCheck size={18} /><p><strong>EQUA obećanje</strong>Ako formula ne odgovara tvojoj rutini, pomoći ćemo ti da pronađeš bolji fit.</p></div>
        </aside>
      </form>
    </div>
  );
}
