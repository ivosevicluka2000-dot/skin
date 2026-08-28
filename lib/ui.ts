import type { Product, ProductCategory, RoutineStep } from "@/lib/data/types";
import { brandById } from "@/lib/data/catalog";
import type { CommerceProduct } from "@/components/commerce-store";

const brandColors = {
  "aurelia-lab": "#beb2dc",
  "botanika-8": "#d8ef7c",
  "derma-nova": "#b9d6df",
  "lumen-skin": "#efb095",
  nordica: "#a9cbd5",
  "terra-calm": "#d8b7af",
} as const;

export const categoryLabels: Record<ProductCategory, string> = {
  cistaci: "Čistači",
  "tonici-i-esencije": "Tonici i esencije",
  serumi: "Serumi",
  kreme: "Kreme",
  spf: "SPF",
  maske: "Maske",
  "ciljana-nega": "Ciljana nega",
};

export const routineStepLabels: Record<RoutineStep, string> = {
  ciscenje: "Čišćenje",
  tonik: "Tonik / esencija",
  tretman: "Tretman",
  hidratacija: "Hidratacija",
  spf: "SPF zaštita",
  maska: "Maska",
  "nega-usana": "Nega usana",
};

export function productColor(product: Product) {
  return brandColors[product.brandId];
}

export function productShape(product: Product): "dropper" | "jar" | "tube" {
  if (product.category === "kreme" || product.category === "maske") return "jar";
  if (product.category === "spf" || product.category === "ciljana-nega") return "tube";
  return "dropper";
}

export function toCommerceProduct(product: Product): CommerceProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: brandById[product.brandId].name,
    price: product.priceRsd,
    color: productColor(product),
    routineStep: routineStepLabels[product.routineStep],
  };
}
