"use client";

import Link from "next/link";
import { ArrowRight, Heart, LoaderCircle, PackageCheck, Sparkles, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCommerce } from "@/components/commerce-store";

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

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}&limit=20`);
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
        <p>
          U MVP fazi ovde su objedinjene sačuvana rutina, lista želja i pronalaženje
          porudžbina putem email adrese.
        </p>
      </section>

      <div className="account-grid">
        <aside className="account-card account-profile">
          <UserRound size={34} aria-hidden="true" />
          <p className="eyebrow">Gost profil</p>
          <h2>Tvoja nega, na jednom mestu.</h2>
          <p>Prijava i trajni korisnički profili dolaze u sledećoj fazi.</p>
          <Link className="text-link" href="/quiz">Osveži skin check <ArrowRight size={16} /></Link>
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
          </div>

          <section className="account-card" style={{ marginTop: 12 }}>
            <p className="eyebrow">Porudžbine</p>
            <h2>Pronađi prethodne kupovine</h2>
            <p>Unesi istu email adresu koju si koristio/la pri poručivanju.</p>
            <form className="checkout-form" onSubmit={findOrders}>
              <div className="form-field form-field--full">
                <label htmlFor="account-email">Email adresa</label>
                <input id="account-email" name="email" type="email" autoComplete="email" required />
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
