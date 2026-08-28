import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop-browser";
import { concerns, products } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Prodavnica", description: "Kurirana nega kože sa jasnim mestom u tvojoj rutini." };

export default function ShopPage() {
  return (
    <>
      <header className="page-hero page-hero--split">
        <div><p className="eyebrow">24 formule · 6 odabranih brendova</p><h1 className="page-title">Manje izbora.<br />Više smisla.</h1></div>
        <p>Svaki proizvod u selekciji rešava jasan zadatak i lako se uklapa u rutinu. Filtriraj po koraku ili onome što koža trenutno traži.</p>
      </header>
      <ShopBrowser products={products} concerns={concerns} />
    </>
  );
}
