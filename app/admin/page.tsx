"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  ChevronRight,
  CircleGauge,
  ExternalLink,
  RefreshCw,
  Search,
  ShoppingBag,
  GraduationCap,
  MessagesSquare,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { brandById, communitySeedPosts, courseDuration, courseLessonCount, courses, products } from "@/lib/data";

type AdminView = "overview" | "orders" | "catalog" | "academy" | "community" | "customers";
type OrderSummary = { id: string; orderNumber: string; status: string; itemCount: number; totalCents: number; currency: string; paymentMethod: string; createdAt: string };
type Overview = {
  orders: number;
  revenueCents: number;
  pending: number;
  customers: number;
  routines: number;
  subscribers: number;
  catalogSize: number;
  lowStock: Array<{ id: string; name: string; quantity: number; status: string }>;
  trend: Array<{ day: string; revenueCents: number; orderCount: number }>;
  events: Array<{ eventType: string; createdAt: string; subjectId: string | null }>;
};

const statusLabels: Record<string, string> = { pending: "Primljena", confirmed: "Potvrđena", processing: "Pakovanje", shipped: "Poslata", complete: "Isporučena", cancelled: "Otkazana" };
const viewLabels: Record<AdminView, string> = { overview: "Pregled", orders: "Porudžbine", catalog: "Katalog", academy: "Akademija", community: "Zajednica", customers: "Kupci" };
const demoOrders: OrderSummary[] = [
  { id: "demo-1", orderNumber: "EQ-1048", status: "pending", itemCount: 3, totalCents: 918_000, currency: "RSD", paymentMethod: "demo_card", createdAt: "2026-08-28 11:42:00" },
  { id: "demo-2", orderNumber: "EQ-1047", status: "processing", itemCount: 4, totalCents: 1_296_000, currency: "RSD", paymentMethod: "cash_on_delivery", createdAt: "2026-08-28 09:18:00" },
  { id: "demo-3", orderNumber: "EQ-1046", status: "shipped", itemCount: 2, totalCents: 668_000, currency: "RSD", paymentMethod: "demo_card", createdAt: "2026-08-27 16:05:00" },
  { id: "demo-4", orderNumber: "EQ-1045", status: "complete", itemCount: 3, totalCents: 897_000, currency: "RSD", paymentMethod: "cash_on_delivery", createdAt: "2026-08-27 12:27:00" },
  { id: "demo-5", orderNumber: "EQ-1044", status: "complete", itemCount: 1, totalCents: 299_000, currency: "RSD", paymentMethod: "demo_card", createdAt: "2026-08-26 18:31:00" },
];
const demoTrend = [38, 52, 45, 68, 61, 86, 74].map((value, index) => ({ day: ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"][index], revenueCents: value * 100_000, orderCount: Math.round(value / 8) }));

function formatMoney(minorUnits: number, currency = "RSD") {
  return new Intl.NumberFormat("sr-RS", { style: "currency", currency, maximumFractionDigits: 0 }).format(minorUnits / 100);
}

export default function AdminPage() {
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [healthResponse, overviewResponse, ordersResponse] = await Promise.all([
        fetch("/api/health", { cache: "no-store" }),
        fetch("/api/admin/overview", { cache: "no-store" }),
        fetch("/api/orders?limit=20", { cache: "no-store" }),
      ]);
      const health = (await healthResponse.json()) as { ok?: boolean };
      const overviewPayload = (await overviewResponse.json()) as { overview?: Overview };
      const orderPayload = (await ordersResponse.json()) as { orders?: OrderSummary[] };
      setDatabaseReady(Boolean(health.ok));
      setOverview(overviewPayload.overview ?? null);
      setOrders(orderPayload.orders ?? []);
    } catch {
      setDatabaseReady(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { const timeout = window.setTimeout(() => void loadDashboard(), 0); return () => window.clearTimeout(timeout); }, [loadDashboard]);

  const demoMode = !overview || overview.orders === 0;
  const visibleOrders = orders.length ? orders : demoOrders;
  const trend = overview && overview.trend.length >= 4 ? overview.trend : demoTrend;
  const revenue = demoMode ? 4_078_000 : overview.revenueCents;
  const orderCount = demoMode ? 148 : overview.orders;
  const customers = demoMode ? 96 : overview.customers;
  const pending = demoMode ? 7 : overview.pending;
  const maxTrend = Math.max(...trend.map((item) => item.revenueCents), 1);
  const conversion = 4.8;

  const lowStock = useMemo(() => products.filter((product) => product.stock.quantity <= 20).sort((a, b) => a.stock.quantity - b.stock.quantity), []);

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link className="wordmark wordmark--light" href="/">EQUA<span>°</span></Link>
        <nav aria-label="Admin navigacija">
          {([
            ["overview", CircleGauge], ["orders", ShoppingBag], ["catalog", Boxes], ["academy", GraduationCap], ["community", MessagesSquare], ["customers", Users],
          ] as const).map(([view, Icon]) => <button key={view} className={activeView === view ? "is-active" : ""} onClick={() => setActiveView(view)}><Icon size={17} /><span>{viewLabels[view]}</span>{view === "orders" && <b>{pending}</b>}</button>)}
        </nav>
        <div className="admin-sidebar__bottom"><div className="admin-status"><i className={databaseReady ? "is-online" : ""} /><span><strong>{databaseReady ? "Sistem online" : "Demo režim"}</strong>{databaseReady ? "D1 povezan" : "Prikazni podaci"}</span></div><Link href="/" target="_blank">Storefront <ExternalLink size={14} /></Link></div>
      </aside>

      <div className="admin-main">
        <header className="admin-commandbar">
          <div><p className="eyebrow">EQUA commerce OS · {demoMode ? "showroom dataset" : "live data"}</p><h1>{viewLabels[activeView]}</h1></div>
          <div><label className="admin-search"><Search size={16} /><input aria-label="Pretraži admin" placeholder="Pretraži…" /></label><button className="admin-refresh" onClick={() => void loadDashboard()} disabled={loading} aria-label="Osveži podatke"><RefreshCw size={17} /></button><span className="admin-avatar">LJ</span></div>
        </header>

        {activeView === "overview" && <>
          <section className="admin-kpis">
            <article><span>Prihod · 7 dana</span><strong>{formatMoney(revenue)}</strong><small className="is-up"><ArrowUpRight /> 18.4%</small></article>
            <article><span>Porudžbine</span><strong>{orderCount}</strong><small className="is-up"><ArrowUpRight /> 12.1%</small></article>
            <article><span>Konverzija</span><strong>{conversion}%</strong><small className="is-up"><ArrowUpRight /> 0.7 pp</small></article>
            <article><span>Prosečna korpa</span><strong>{formatMoney(Math.round(revenue / orderCount))}</strong><small><ArrowDownRight /> 2.3%</small></article>
          </section>

          <section className="admin-dashboard-grid">
            <article className="admin-module admin-module--chart">
              <div className="admin-module__head"><div><span>Prodaja</span><h2>Ritam prihoda</h2></div><select aria-label="Period grafikona"><option>Poslednjih 7 dana</option></select></div>
              <div className="revenue-chart" aria-label="Grafikon prihoda po danima">{trend.map((item) => <div key={item.day}><span style={{ height: `${Math.max(12, item.revenueCents / maxTrend * 100)}%` }}><i>{formatMoney(item.revenueCents)}</i></span><small>{item.day.length > 3 ? new Date(`${item.day}T00:00:00`).toLocaleDateString("sr-RS", { weekday: "short" }) : item.day}</small></div>)}</div>
            </article>
            <article className="admin-module admin-module--pulse">
              <div className="admin-module__head"><div><span>Live signal</span><h2>Danas</h2></div><Zap size={20} /></div>
              <div className="pulse-number"><strong>27</strong><span>aktivnih poseta</span></div>
              <div className="pulse-map"><i /><i /><i /><i /><i /></div>
              <div className="admin-mini-row"><span>Dodato u korpu</span><strong>18</strong></div><div className="admin-mini-row"><span>Pokrenut skin check</span><strong>31</strong></div><div className="admin-mini-row"><span>Završena kupovina</span><strong>7</strong></div>
            </article>
          </section>

          <section className="admin-dashboard-grid admin-dashboard-grid--lower">
            <article className="admin-module"><div className="admin-module__head"><div><span>Funnel</span><h2>Put do kupovine</h2></div><BarChart3 size={20} /></div><div className="conversion-funnel"><div><span>Posete</span><b style={{ width: "100%" }} /><strong>2.840</strong></div><div><span>PDP pregled</span><b style={{ width: "68%" }} /><strong>1.932</strong></div><div><span>Dodato u korpu</span><b style={{ width: "24%" }} /><strong>681</strong></div><div><span>Kupovina</span><b style={{ width: "8%" }} /><strong>136</strong></div></div></article>
            <article className="admin-module"><div className="admin-module__head"><div><span>Zalihe</span><h2>Traži pažnju</h2></div><button onClick={() => setActiveView("catalog")}>Svi proizvodi <ChevronRight size={15} /></button></div><div className="stock-list">{lowStock.slice(0, 4).map((product) => <div key={product.id}><span className="stock-thumb" style={{ background: product.stock.quantity === 0 ? "var(--peach)" : "var(--lilac)" }} /><p><strong>{product.name}</strong><small>{brandById[product.brandId].name}</small></p><b className={product.stock.quantity === 0 ? "is-out" : ""}>{product.stock.quantity} kom.</b></div>)}</div></article>
          </section>
        </>}

        {activeView === "orders" && <section className="admin-module admin-orders-module"><div className="admin-module__head"><div><span>Operativa</span><h2>Sve porudžbine</h2></div><div className="admin-table-filters"><button className="is-active">Sve</button><button>Čekaju</button><button>Poslate</button></div></div><OrderTable orders={visibleOrders} /></section>}

        {activeView === "catalog" && <section className="admin-module admin-orders-module"><div className="admin-module__head"><div><span>{products.length} SKU</span><h2>Katalog i zalihe</h2></div><Link className="button button--dark" href="/shop">Storefront <ArrowUpRight size={15} /></Link></div><div className="admin-table-wrap"><table className="admin-data-table"><thead><tr><th>Proizvod</th><th>Brend</th><th>Kategorija</th><th>Cena</th><th>Zaliha</th><th>Status</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="admin-product-cell"><span style={{ background: product.stock.quantity <= 10 ? "var(--peach)" : "var(--acid-soft)" }} /><strong>{product.name}</strong></div></td><td>{brandById[product.brandId].name}</td><td>{product.category.replaceAll("-", " ")}</td><td>{formatMoney(product.priceRsd * 100)}</td><td>{product.stock.quantity}</td><td><span className={`status-pill status-pill--${product.stock.status === "nema-na-stanju" ? "cancelled" : product.stock.status === "malo-na-stanju" ? "pending" : "complete"}`}>{product.stock.status.replaceAll("-", " ")}</span></td></tr>)}</tbody></table></div></section>}

        {activeView === "academy" && <section className="admin-module admin-orders-module"><div className="admin-module__head"><div><span>Learning commerce</span><h2>Programi i lekcije</h2></div><Link className="button button--dark" href="/academy">Otvori Akademiju <ArrowUpRight size={15} /></Link></div><div className="admin-course-list">{courses.map((course) => <article key={course.id}><span style={{ background: course.accent }}><GraduationCap /></span><div><small>{course.eyebrow}</small><strong>{course.title}</strong><p>{courseLessonCount(course)} lekcija · {courseDuration(course)} min · {course.priceRsd === 0 ? "besplatno" : formatMoney(course.priceRsd * 100)}</p></div><div><strong>{course.featured ? "Istaknuto" : "Objavljeno"}</strong><small>{course.modules.length} modula</small></div><button aria-label={`Uredi ${course.title}`}><ChevronRight /></button></article>)}</div></section>}

        {activeView === "community" && <section className="admin-module admin-orders-module"><div className="admin-module__head"><div><span>Moderation queue · 0 prijava</span><h2>Diskusije i community health</h2></div><Link className="button button--dark" href="/community">Otvori Club <ArrowUpRight size={15} /></Link></div><div className="admin-community-kpis"><article><span>Aktivni članovi</span><strong>1.284</strong><small>showroom metrika</small></article><article><span>Odgovor eksperta</span><strong>2h 14m</strong><small>prosečno vreme</small></article><article><span>Prijavljeni sadržaj</span><strong>0.6%</strong><small>poslednjih 30 dana</small></article></div><div className="admin-table-wrap"><table className="admin-data-table"><thead><tr><th>Tema</th><th>Autor</th><th>Prostor</th><th>Odgovori</th><th>Status</th></tr></thead><tbody>{communitySeedPosts.map((post) => <tr key={post.id}><td><strong>{post.title}</strong></td><td>{post.authorName}</td><td>{post.spaceId}</td><td>{post.replies}</td><td><span className="status-pill status-pill--complete">objavljeno</span></td></tr>)}</tbody></table></div></section>}

        {activeView === "customers" && <section className="admin-customer-view"><div className="admin-customer-hero"><span><Sparkles /></span><div><p className="eyebrow">Customer intelligence</p><h2>{customers} profila kože u razvoju.</h2><p>Skin check pretvara anonimnu kupovinu u kontekst: cilj, osetljivost, iskustvo sa aktivima i realan broj koraka.</p></div></div><div className="admin-customer-grid"><article><span>Najčešći cilj</span><strong>Hidratacija</strong><small>31% skin check rezultata</small></article><article><span>Najčešća rutina</span><strong>Mirna barijera</strong><small>24 sačuvana plana</small></article><article><span>Repeat rate</span><strong>28.6%</strong><small>+4.2% u odnosu na jul</small></article></div></section>}
      </div>
    </div>
  );
}

function OrderTable({ orders }: { orders: OrderSummary[] }) {
  return <div className="admin-table-wrap"><table className="admin-data-table"><thead><tr><th>Porudžbina</th><th>Datum</th><th>Status</th><th>Stavke</th><th>Plaćanje</th><th>Ukupno</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.orderNumber}</strong></td><td>{new Date(`${order.createdAt.replace(" ", "T")}Z`).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</td><td><span className={`status-pill status-pill--${order.status}`}>{statusLabels[order.status] ?? order.status}</span></td><td>{order.itemCount}</td><td>{order.paymentMethod === "cash_on_delivery" ? "Pouzećem" : "Kartica"}</td><td><strong>{formatMoney(order.totalCents, order.currency)}</strong></td><td><button aria-label={`Otvori ${order.orderNumber}`}><ChevronRight size={16} /></button></td></tr>)}</tbody></table></div>;
}
