import type { Metadata } from "next";
import Link from "next/link";
import { concerns, ingredients } from "@/lib/data/catalog";
import type { IngredientId } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Atlas sastojaka",
  description: "Razumi šta aktivni sastojci rade, kome odgovaraju i kako se bezbedno uklapaju u rutinu.",
};

const groups: Array<{ title: string; description: string; ids: IngredientId[] }> = [
  {
    title: "Aktivni tretmani",
    description: "Ciljani sastojci za nepravilnosti, tragove, teksturu i prve znake starenja.",
    ids: ["niacinamid", "salicilna-kiselina", "retinal", "vitamin-c", "azelainska-kiselina", "peptidi"],
  },
  {
    title: "Barijera i hidratacija",
    description: "Sastojci koji vraćaju vodu, lipide i osećaj komfora bez komplikovanja rutine.",
    ids: ["hijaluronska-kiselina", "ceramidi", "centela", "skvalan", "pantenol"],
  },
  {
    title: "Dnevna zaštita",
    description: "Sastojci koji čuvaju rezultate rutine i štite kožu od novih oštećenja.",
    ids: ["uv-filteri"],
  },
];

export default function IngredientsPage() {
  return (
    <>
      <section className="page-hero page-hero--split">
        <div>
          <p className="eyebrow">Atlas sastojaka · bez beauty žargona</p>
          <h1 className="page-title">Čitaj formulu, ne hajp.</h1>
        </div>
        <p>Jasan vodič kroz {ingredients.length} sastojaka: šta rade, kome odgovaraju i sa čim ih treba kombinovati ili razdvojiti.</p>
      </section>

      <section className="ingredient-intro">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Počni od potrebe kože</p>
            <h2 className="section-title">Jedan sastojak.<br />Jasna uloga.</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, maxWidth: 590 }}>
            {concerns.map((concern) => (
              <Link className="filter-chip" href={`/concerns/${concern.slug}`} key={concern.id}>{concern.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <div className="ingredient-groups">
        {groups.map((group) => (
          <section className="ingredient-group" key={group.title}>
            <div className="ingredient-group__head">
              <h2>{group.title}</h2>
              <p style={{ maxWidth: 580, margin: 0, color: "var(--muted)" }}>{group.description}</p>
            </div>
            <div className="ingredient-grid">
              {group.ids.map((id) => {
                const ingredient = ingredients.find((item) => item.id === id);
                if (!ingredient) return null;
                const symbol = ingredient.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

                return (
                  <article className="ingredient-card" id={ingredient.slug} key={ingredient.id}>
                    <div>
                      <div className="ingredient-card__symbol">{symbol}</div>
                      <span>{ingredient.family}</span>
                      <h3>{ingredient.name}</h3>
                      <p>{ingredient.summary}</p>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <span>Najbolje za</span>
                      <p style={{ marginTop: 7 }}>
                        {ingredient.bestForConcernIds.map((concernId) => concerns.find((concern) => concern.id === concernId)?.name).filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
