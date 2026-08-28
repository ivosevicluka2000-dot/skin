"use client";

import Link from "next/link";
import { Heart, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data/types";
import { brandById, formatRsd } from "@/lib/data/catalog";
import { productColor, toCommerceProduct } from "@/lib/ui";
import { ProductPhoto } from "./product-photo";
import { useCommerce } from "./commerce-store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, addToRoutine, toggleWishlist, wishlist } = useCommerce();
  const commerceProduct = toCommerceProduct(product);
  const wished = wishlist.includes(product.slug);
  const unavailable = product.stock.status === "nema-na-stanju";

  return (
    <article className="product-card" style={{ "--card-color": productColor(product) } as React.CSSProperties}>
      <div className="product-card__visual">
        <Link href={`/product/${product.slug}`} aria-label={`Otvori ${product.name}`}>
          <ProductPhoto product={product} />
        </Link>
        <div className="product-card__badges">
          {product.bestseller && <span>Bestseller</span>}
          {product.newArrival && <span>Novo</span>}
          {unavailable && <span>Uskoro</span>}
        </div>
        <button
          className={`product-card__heart ${wished ? "is-active" : ""}`}
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wished ? `Ukloni ${product.name} iz liste želja` : `Sačuvaj ${product.name}`}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>
        <div className="product-card__actions">
          <button disabled={unavailable} onClick={() => addToCart(commerceProduct)}>
            <ShoppingBag size={15} /> {unavailable ? "Nije dostupno" : "Dodaj u korpu"}
          </button>
          <button onClick={() => addToRoutine(commerceProduct)} aria-label={`Dodaj ${product.name} u rutinu`}>
            <Plus size={17} />
          </button>
        </div>
      </div>
      <div className="product-card__meta">
        <div className="product-card__brand">
          <span>{brandById[product.brandId].name}</span>
          <span>★ {product.rating.average.toFixed(1)}</span>
        </div>
        <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-card__price">
          <strong>{formatRsd(product.priceRsd)}</strong>
          <span>{product.size}</span>
        </div>
      </div>
    </article>
  );
}
