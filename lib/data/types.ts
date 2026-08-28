export type BrandId =
  | "aurelia-lab"
  | "botanika-8"
  | "derma-nova"
  | "lumen-skin"
  | "nordica"
  | "terra-calm";

export type ConcernId =
  | "akne"
  | "osetljivost"
  | "crvenilo"
  | "suvoca"
  | "dehidratacija"
  | "hiperpigmentacija"
  | "prvi-znaci-starenja"
  | "bez-sjaja";

export type IngredientId =
  | "niacinamid"
  | "hijaluronska-kiselina"
  | "salicilna-kiselina"
  | "retinal"
  | "ceramidi"
  | "vitamin-c"
  | "azelainska-kiselina"
  | "centela"
  | "peptidi"
  | "skvalan"
  | "pantenol"
  | "uv-filteri";

export type ProductId =
  | "dn-gentle-cleanser"
  | "dn-bha-toner"
  | "dn-azelaic-serum"
  | "dn-daily-spf50"
  | "al-vitamin-c-serum"
  | "al-retinal-emulsion"
  | "al-peptide-cream"
  | "al-eye-peptide-gel"
  | "tc-centella-cleanser"
  | "tc-barrier-serum"
  | "tc-ceramide-cream"
  | "tc-mineral-spf50"
  | "lumen-niacinamide-serum"
  | "lumen-glow-essence"
  | "lumen-brightening-cream"
  | "lumen-invisible-spf50"
  | "nordica-hydra-cleanser"
  | "nordica-ha-serum"
  | "nordica-squalane-cream"
  | "nordica-sleeping-mask"
  | "b8-cleansing-balm"
  | "b8-calming-mist"
  | "b8-panthenol-balm"
  | "b8-lip-treatment";

export type SkinType =
  | "normalna"
  | "suva"
  | "masna"
  | "mesovita"
  | "osetljiva";

export type RoutineStep =
  | "ciscenje"
  | "tonik"
  | "tretman"
  | "hidratacija"
  | "spf"
  | "maska"
  | "nega-usana";

export type ProductCategory =
  | "cistaci"
  | "tonici-i-esencije"
  | "serumi"
  | "kreme"
  | "spf"
  | "maske"
  | "ciljana-nega";

export interface Brand {
  id: BrandId;
  name: string;
  country: string;
  tagline: string;
  description: string;
}

export interface Concern {
  id: ConcernId;
  slug: string;
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  accent: string;
  image: string;
  recommendedIngredientIds: IngredientId[];
}

export interface IngredientPairing {
  ingredientId: IngredientId;
  relationship: "kombinuj" | "razdvoji";
  note: string;
}

export interface Ingredient {
  id: IngredientId;
  slug: string;
  name: string;
  family: string;
  summary: string;
  description: string;
  benefits: string[];
  bestForConcernIds: ConcernId[];
  suitableSkinTypes: SkinType[];
  usage: string;
  caution?: string;
  pairings: IngredientPairing[];
  image: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductStock {
  quantity: number;
  status: "na-stanju" | "malo-na-stanju" | "nema-na-stanju";
}

export interface Product {
  id: ProductId;
  slug: string;
  sku: string;
  name: string;
  brandId: BrandId;
  category: ProductCategory;
  priceRsd: number;
  compareAtPriceRsd?: number;
  size: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  usage: string;
  concernIds: ConcernId[];
  ingredientIds: IngredientId[];
  skinTypes: SkinType[];
  routineStep: RoutineStep;
  timeOfDay: Array<"am" | "pm">;
  rating: ProductRating;
  stock: ProductStock;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  image: string;
  gallery: string[];
  safetyNote?: string;
}

export type ArticleCategory =
  | "osnove-nege"
  | "sastojci"
  | "rutine"
  | "strucni-vodic";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  callout?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  category: ArticleCategory;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  image: string;
  featured: boolean;
  concernIds: ConcernId[];
  ingredientIds: IngredientId[];
  relatedProductIds: ProductId[];
  sections: ArticleSection[];
}

export type RoutineId =
  | "balans"
  | "cista-koza"
  | "mirna-barijera"
  | "duboka-hidratacija"
  | "ujednacen-ten"
  | "age-support";

export interface RoutineItem {
  productId: ProductId;
  order: number;
  note: string;
  optional?: boolean;
}

export interface Routine {
  id: RoutineId;
  name: string;
  shortName: string;
  description: string;
  accent: string;
  primaryConcernIds: ConcernId[];
  morning: RoutineItem[];
  evening: RoutineItem[];
}

export type QuizQuestionId =
  | "skin-feel"
  | "primary-goal"
  | "sensitivity"
  | "experience"
  | "routine-length"
  | "spf-habit"
  | "pregnancy";

export interface QuizAnswer {
  id: string;
  label: string;
  description?: string;
  scores: Partial<Record<RoutineId, number>>;
}

export interface QuizQuestion {
  id: QuizQuestionId;
  title: string;
  helper: string;
  type: "single";
  required: boolean;
  answers: QuizAnswer[];
}

export interface QuizRecommendation {
  routineId: RoutineId;
  scores: Record<RoutineId, number>;
  answerIds: string[];
  excludedProductIds: ProductId[];
  safetyMessages: string[];
}
