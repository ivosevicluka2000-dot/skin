"use client";

import Link from "next/link";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";

type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  itemCount: number;
  totalCents: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  pending: "Primljena",
  confirmed: "Potvrđena",
  processing: "Priprema",
  shipped: "Poslata",
  complete: "Isporučena",
  cancelled: "Otkazana",
};

function formatMoney(minorUnits: number, currency = "RSD") {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [healthResponse, ordersResponse] = await Promise.all([
        fetch("/api/health", { cache: "no-store" }),
        fetch("/api/orders?limit=20", { cache: "no-store" }),
      ]);
      const health = (await healthResponse.json()) as { ok?: boolean };
      const orderPayload = (await ordersResponse.json()) as {
        ok?: boolean;
        orders?: OrderSummary[];
        error?: { message?: string };
      };
      if (!ordersResponse.ok) {
        throw new Error(orderPayload.error?.message || "Dashboard podaci nisu dostupni.");
      }
      setDatabaseReady(Boolean(health.ok));
      setOrders(orderPayload.orders ?? []);
    } catch (requestError) {
      setDatabaseReady(false);
      setError(requestError instanceof Error ? requestError.message : "Osvežavanje nije uspelo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadDashboard(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadDashboard]);

  const revenue = useMemo(
    () => orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.totalCents, 0),
    [orders],
  );
  const pending = orders.filter((order) => order.status === "pending").length;

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <div>
          <p className="eyebrow">EQUA operations · Demo MVP</p>
          <h1>Kontrolna tabla</h1>
        </div>
        <button className="button button--ghost" type="button" onClick={() => void loadDashboard()} disabled={loading}>
          <RefreshCw size={17} aria-hidden="true" /> {loading ? "Osvežavanje…" : "Osveži"}
        </button>
      </div>

      <div className="admin-stats">
        <article className="admin-stat"><span>Katalog</span><strong>{products.length}</strong><small>aktivnih proizvoda</small></article>
        <article className="admin-stat"><span>Porudžbine</span><strong>{orders.length}</strong><small>u poslednjem pregledu</small></article>
        <article className="admin-stat"><span>Čeka potvrdu</span><strong>{pending}</strong><small>zahteva obradu</small></article>
        <article className="admin-stat"><span>Vrednost</span><strong>{formatMoney(revenue)}</strong><small>bez otkazanih</small></article>
      </div>

      <section className="admin-table">
        <div className="admin-top">
          <div>
            <p className="eyebrow">Poslednje porudžbine</p>
            <small>{databaseReady ? "Baza je povezana" : "Baza trenutno nije dostupna"}</small>
          </div>
          <Link className="text-link" href="/shop">Otvori prodavnicu <ArrowUpRight size={16} /></Link>
        </div>

        {error ? (
          <p role="alert">{error}</p>
        ) : orders.length === 0 ? (
          <p>{loading ? "Učitavamo porudžbine…" : "Još nema porudžbina. Testiraj checkout iz prodavnice."}</p>
        ) : (
          <table>
            <thead>
              <tr><th>Broj</th><th>Datum</th><th>Status</th><th>Stavke</th><th>Plaćanje</th><th>Ukupno</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>{new Date(`${order.createdAt.replace(" ", "T")}Z`).toLocaleDateString("sr-RS")}</td>
                  <td>{statusLabels[order.status] ?? order.status}</td>
                  <td>{order.itemCount}</td>
                  <td>{order.paymentMethod === "cash_on_delivery" ? "Pouzećem" : "Demo kartica"}</td>
                  <td>{formatMoney(order.totalCents, order.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
