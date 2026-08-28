"use client";

import Link from "next/link";
import { ArrowLeft, Check, LoaderCircle, LockKeyhole, ShoppingBag } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCommerce } from "@/components/commerce-store";

type CreatedOrder = {
  id: string;
  orderNumber: string;
  totalCents: number;
  currency: string;
};

type OrderResponse = {
  ok: boolean;
  order?: CreatedOrder;
  error?: { message?: string };
};

function formatRsd(value: number) {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CartPage() {
  const { cart, subtotal, setQuantity } = useCommerce();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const shipping = subtotal >= 6_000 ? 0 : 390;
  const total = subtotal + shipping;

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0 || submitting) return;

    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: form.get("email"),
            firstName: form.get("firstName"),
            lastName: form.get("lastName"),
            phone: form.get("phone"),
          },
          shippingAddress: {
            addressLine1: form.get("addressLine1"),
            addressLine2: form.get("addressLine2"),
            city: form.get("city"),
            postalCode: form.get("postalCode"),
            country: "RS",
          },
          paymentMethod: form.get("paymentMethod"),
          notes: form.get("notes"),
          currency: "RSD",
          shippingCents: shipping * 100,
          items: cart.map(({ product, quantity }) => ({
            productId: product.id,
            productName: product.name,
            variantName: product.brand,
            routineSlot: product.routineStep,
            quantity,
            unitPriceCents: product.price * 100,
          })),
        }),
      });
      const payload = (await response.json()) as OrderResponse;
      if (!response.ok || !payload.order) {
        throw new Error(payload.error?.message || "Porudžbina trenutno ne može da se sačuva.");
      }

      setCreatedOrder(payload.order);
      cart.forEach(({ product }) => setQuantity(product.slug, 0));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Došlo je do greške. Pokušaj ponovo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (createdOrder) {
    return (
      <section className="checkout-success">
        <div>
          <span aria-hidden="true"><Check size={42} /></span>
          <p className="eyebrow">Porudžbina je primljena</p>
          <h1>Hvala, sada je red na nas.</h1>
          <p>
            Broj porudžbine je <strong>{createdOrder.orderNumber}</strong>. Sačuvali smo
            porudžbinu u iznosu od {formatRsd(createdOrder.totalCents / 100)}.
          </p>
          <Link className="button button--dark" href="/account">
            Prati porudžbinu
          </Link>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout-success">
        <div>
          <span aria-hidden="true"><ShoppingBag size={38} /></span>
          <p className="eyebrow">Tvoja korpa</p>
          <h1>Ovde još nema proizvoda.</h1>
          <p>Dodaj pojedinačan proizvod ili složi kompletnu rutinu uz skin check.</p>
          <Link className="button button--dark" href="/shop">
            <ArrowLeft size={18} /> Nazad u prodavnicu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero page-hero--split">
        <div>
          <p className="eyebrow">Sigurna završnica</p>
          <h1 className="page-title">Dostava i plaćanje.</h1>
        </div>
        <p>
          Proveri podatke i potvrdi porudžbinu. U MVP verziji dostupno je plaćanje
          pouzećem i bezbedan demo kartični tok.
        </p>
      </section>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder}>
          <div className="form-field form-field--full">
            <p className="eyebrow">01 · Kontakt</p>
          </div>
          <div className="form-field">
            <label htmlFor="firstName">Ime</label>
            <input id="firstName" name="firstName" autoComplete="given-name" required />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Prezime</label>
            <input id="lastName" name="lastName" autoComplete="family-name" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Telefon</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" />
          </div>

          <div className="form-field form-field--full">
            <p className="eyebrow">02 · Adresa</p>
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="addressLine1">Ulica i broj</label>
            <input id="addressLine1" name="addressLine1" autoComplete="address-line1" required />
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="addressLine2">Stan, sprat ili napomena za adresu</label>
            <input id="addressLine2" name="addressLine2" autoComplete="address-line2" />
          </div>
          <div className="form-field">
            <label htmlFor="city">Grad</label>
            <input id="city" name="city" autoComplete="address-level2" required />
          </div>
          <div className="form-field">
            <label htmlFor="postalCode">Poštanski broj</label>
            <input id="postalCode" name="postalCode" inputMode="numeric" autoComplete="postal-code" required />
          </div>

          <div className="form-field form-field--full">
            <p className="eyebrow">03 · Plaćanje</p>
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="paymentMethod">Način plaćanja</label>
            <select id="paymentMethod" name="paymentMethod" defaultValue="cash_on_delivery">
              <option value="cash_on_delivery">Pouzećem pri dostavi</option>
              <option value="demo_card">Demo kartica — bez stvarne naplate</option>
            </select>
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="notes">Napomena kuriru</label>
            <textarea id="notes" name="notes" rows={3} />
          </div>

          {error && <p className="form-field--full" role="alert">{error}</p>}
          <button className="button button--dark form-field--full" type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle size={18} aria-hidden="true" /> : <LockKeyhole size={18} aria-hidden="true" />}
            {submitting ? "Čuvamo porudžbinu…" : `Potvrdi · ${formatRsd(total)}`}
          </button>
        </form>

        <aside className="checkout-summary" aria-label="Pregled porudžbine">
          <h2>Tvoja porudžbina</h2>
          {cart.map(({ product, quantity }) => (
            <div className="checkout-summary__line" key={product.slug}>
              <div><strong>{product.name}</strong><br /><small>{product.brand} · {quantity} kom.</small></div>
              <strong>{formatRsd(product.price * quantity)}</strong>
            </div>
          ))}
          <div className="checkout-summary__line">
            <span>Međuzbir</span><strong>{formatRsd(subtotal)}</strong>
          </div>
          <div className="checkout-summary__line">
            <span>Dostava</span><strong>{shipping === 0 ? "Besplatno" : formatRsd(shipping)}</strong>
          </div>
          <div className="checkout-summary__line">
            <strong>Ukupno</strong><strong>{formatRsd(total)}</strong>
          </div>
          <p><LockKeyhole size={14} aria-hidden="true" /> Podaci se koriste samo za obradu ove demo porudžbine.</p>
        </aside>
      </div>
    </>
  );
}
