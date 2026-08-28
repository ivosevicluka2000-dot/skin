"use client";

import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import type { Product } from "@/lib/data/types";
import { toCommerceProduct } from "@/lib/ui";
import { useCommerce } from "./commerce-store";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addToCart, addToRoutine, toggleWishlist, wishlist } = useCommerce();
  const wished = wishlist.includes(product.slug);
  const unavailable = product.stock.status === "nema-na-stanju";
  const item = toCommerceProduct(product);
  return (
    <div className="detail-actions">
      <button className="button button--dark" disabled={unavailable} onClick={() => addToCart(item)}><ShoppingBag size={17} /> {unavailable ? "Trenutno nedostupno" : "Dodaj u korpu"}</button>
      <button className="button button--acid" onClick={() => addToRoutine(item)}><Sparkles size={17} /> Dodaj u rutinu</button>
      <button className="button button--ghost" onClick={() => toggleWishlist(product.slug)}><Heart size={17} fill={wished ? "currentColor" : "none"} /> {wished ? "Sačuvano" : "Sačuvaj"}</button>
    </div>
  );
}
