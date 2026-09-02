import type { Metadata } from "next";
import { HomeExperience } from "@/components/home-experience";
import { articles, concerns, products } from "@/lib/data/catalog";
import { courses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pametnija nega kože",
  description: "Personalizovane rutine, jasni vodiči i pažljivo odabrana nega kože na jednom mestu.",
};

export default function Home() {
  return <HomeExperience concerns={concerns} products={products.filter((product) => product.featured)} articles={articles} courses={courses} />;
}
