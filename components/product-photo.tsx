/* eslint-disable @next/next/no-img-element -- Vinext serves these checked-in, pre-compressed catalog assets directly. */

import type { Product, ProductCategory } from "@/lib/data/types";

const categoryPhotography: Record<ProductCategory, string> = {
  cistaci: "/images/products/cleanser.jpg",
  "tonici-i-esencije": "/images/products/essence.jpg",
  serumi: "/images/products/serum.jpg",
  kreme: "/images/products/cream.jpg",
  spf: "/images/products/spf.jpg",
  maske: "/images/products/cream.jpg",
  "ciljana-nega": "/images/products/essence.jpg",
};

export function productPhotoFor(product: Product) {
  return categoryPhotography[product.category];
}

export function ProductPhoto({ product, eager = false }: { product: Product; eager?: boolean }) {
  return (
    <img
      className="product-photo"
      src={productPhotoFor(product)}
      alt={`${product.name}, ${product.size}`}
      width={1200}
      height={1200}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
