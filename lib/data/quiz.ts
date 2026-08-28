import type {
  ProductId,
  QuizAnswer,
  QuizQuestion,
  QuizRecommendation,
  Routine,
  RoutineId,
} from "./types";

export const routines: readonly Routine[] = [
  {
    id: "balans",
    name: "Dnevni balans",
    shortName: "Balans",
    description: "Lagana i održiva rutina za stabilnu kožu bez jednog dominantnog problema.",
    accent: "#A7AD83",
    primaryConcernIds: ["bez-sjaja", "dehidratacija"],
    morning: [
      { productId: "dn-gentle-cleanser", order: 1, note: "Kratko i nežno čišćenje." },
      { productId: "lumen-niacinamide-serum", order: 2, note: "Jedna pumpica za balans i barijeru." },
      { productId: "lumen-invisible-spf50", order: 3, note: "Obilno nanesi kao završni korak." },
    ],
    evening: [
      { productId: "b8-cleansing-balm", order: 1, note: "Otopi SPF i šminku." },
      { productId: "dn-gentle-cleanser", order: 2, note: "Drugo čišćenje samo kada je potrebno.", optional: true },
      { productId: "lumen-brightening-cream", order: 3, note: "Završi laganom hidratacijom." },
    ],
  },
  {
    id: "cista-koza",
    name: "Čista koža, mirna barijera",
    shortName: "Čista koža",
    description: "Kontrolisan BHA ritam i svakodnevna podrška bez agresivnog odmašćivanja.",
    accent: "#A8B46C",
    primaryConcernIds: ["akne"],
    morning: [
      { productId: "dn-gentle-cleanser", order: 1, note: "Ukloni višak sebuma bez zatezanja." },
      { productId: "lumen-niacinamide-serum", order: 2, note: "Balansirajući serum za svaki dan." },
      { productId: "dn-daily-spf50", order: 3, note: "Matirajuća dnevna zaštita." },
    ],
    evening: [
      { productId: "dn-gentle-cleanser", order: 1, note: "Temeljno, ali nežno čišćenje." },
      { productId: "dn-bha-toner", order: 2, note: "Samo dva do tri puta nedeljno." },
      { productId: "dn-azelaic-serum", order: 3, note: "Koristi večerima bez BHA dok koža ne stekne toleranciju." },
      { productId: "lumen-brightening-cream", order: 4, note: "Lagana završna hidratacija." },
    ],
  },
  {
    id: "mirna-barijera",
    name: "Mirna i zaštićena barijera",
    shortName: "Mirna barijera",
    description: "Minimalna rutina za crvenilo, reaktivnost i kožu kojoj je potreban predah.",
    accent: "#D8B7AF",
    primaryConcernIds: ["osetljivost", "crvenilo"],
    morning: [
      { productId: "tc-centella-cleanser", order: 1, note: "Po potrebi; ako koža nije masna, dovoljna je voda." },
      { productId: "tc-barrier-serum", order: 2, note: "Nanesi bez trljanja." },
      { productId: "tc-ceramide-cream", order: 3, note: "Tanak zaštitni sloj." },
      { productId: "tc-mineral-spf50", order: 4, note: "Završi visokom zaštitom." },
    ],
    evening: [
      { productId: "tc-centella-cleanser", order: 1, note: "Isperi mlakom, ne vrućom vodom." },
      { productId: "tc-barrier-serum", order: 2, note: "Dve pumpice na blago vlažnu kožu." },
      { productId: "tc-ceramide-cream", order: 3, note: "Zaključaj hidrataciju." },
      { productId: "b8-panthenol-balm", order: 4, note: "Lokalno na osetljive zone.", optional: true },
    ],
  },
  {
    id: "duboka-hidratacija",
    name: "Duboka hidratacija",
    shortName: "Hidratacija",
    description: "Slojevi vode i lipida za kožu koja zateže, peruta se ili izgleda umorno.",
    accent: "#8BB8C4",
    primaryConcernIds: ["dehidratacija", "suvoca"],
    morning: [
      { productId: "nordica-hydra-cleanser", order: 1, note: "Nežno jutarnje čišćenje." },
      { productId: "nordica-ha-serum", order: 2, note: "Na blago vlažnu kožu." },
      { productId: "nordica-squalane-cream", order: 3, note: "Tanak sloj za zadržavanje vlage." },
      { productId: "lumen-invisible-spf50", order: 4, note: "Hidratantna dnevna zaštita." },
    ],
    evening: [
      { productId: "b8-cleansing-balm", order: 1, note: "Otopi SPF bez isušivanja." },
      { productId: "nordica-ha-serum", order: 2, note: "Vrati vodi mesto u rutini." },
      { productId: "nordica-squalane-cream", order: 3, note: "Zaključaj vlagu." },
      { productId: "nordica-sleeping-mask", order: 4, note: "Dva puta nedeljno umesto ili preko kreme.", optional: true },
    ],
  },
  {
    id: "ujednacen-ten",
    name: "Ujednačen i blistav ten",
    shortName: "Ujednačen ten",
    description: "Antioksidativna jutarnja nega i blagi večernji aktivi za tragove i umoran izgled.",
    accent: "#B690C7",
    primaryConcernIds: ["hiperpigmentacija", "bez-sjaja"],
    morning: [
      { productId: "dn-gentle-cleanser", order: 1, note: "Blaga priprema kože." },
      { productId: "al-vitamin-c-serum", order: 2, note: "Antioksidativna podrška i sjaj." },
      { productId: "lumen-brightening-cream", order: 3, note: "Lagana hidratacija sa niacinamidom." },
      { productId: "lumen-invisible-spf50", order: 4, note: "Obavezan završni korak protiv novih fleka." },
    ],
    evening: [
      { productId: "b8-cleansing-balm", order: 1, note: "Ukloni SPF i šminku." },
      { productId: "dn-azelaic-serum", order: 2, note: "Tanak sloj za tragove i ujednačeniji izgled." },
      { productId: "lumen-brightening-cream", order: 3, note: "Završi hidratacijom." },
    ],
  },
  {
    id: "age-support",
    name: "Pametna age-support rutina",
    shortName: "Age support",
    description: "Postepeni retinal, peptidi i svakodnevna fotoprotekcija za dugoročne rezultate.",
    accent: "#9C866B",
    primaryConcernIds: ["prvi-znaci-starenja"],
    morning: [
      { productId: "nordica-hydra-cleanser", order: 1, note: "Nežno čišćenje bez zatezanja." },
      { productId: "al-vitamin-c-serum", order: 2, note: "Antioksidativni serum." },
      { productId: "al-peptide-cream", order: 3, note: "Peptidna podrška i hidratacija." },
      { productId: "lumen-invisible-spf50", order: 4, note: "Visoka zaštita svakog jutra." },
    ],
    evening: [
      { productId: "b8-cleansing-balm", order: 1, note: "Temeljno ukloni dnevnu zaštitu." },
      { productId: "al-retinal-emulsion", order: 2, note: "Počni jednom do dva puta nedeljno." },
      { productId: "al-peptide-cream", order: 3, note: "Završi negujućom kremom." },
    ],
  },
];

export const quizQuestions: readonly QuizQuestion[] = [
  {
    id: "skin-feel",
    title: "Kako se tvoja koža najčešće oseća do sredine dana?",
    helper: "Izaberi odgovor koji opisuje većinu dana, ne samo današnje stanje.",
    type: "single",
    required: true,
    answers: [
      { id: "feel-tight", label: "Zateže ili se peruta", description: "Posebno posle umivanja.", scores: { "duboka-hidratacija": 4, "mirna-barijera": 1 } },
      { id: "feel-shiny", label: "Brzo se prosija", description: "Najviše u T-zoni ili po celom licu.", scores: { "cista-koza": 3, balans: 1 } },
      { id: "feel-both", label: "Istovremeno sija i zateže", description: "Čest znak dehidrirane mešovite kože.", scores: { "duboka-hidratacija": 3, balans: 2 } },
      { id: "feel-comfortable", label: "Uglavnom je stabilna", description: "Bez izražene suvoće ili viška sebuma.", scores: { balans: 4, "ujednacen-ten": 1 } },
    ],
  },
  {
    id: "primary-goal",
    title: "Šta prvo želiš da promeniš?",
    helper: "Izabraćemo jednu glavnu temu da rutina ostane fokusirana.",
    type: "single",
    required: true,
    answers: [
      { id: "goal-breakouts", label: "Bubuljice i zapušene pore", scores: { "cista-koza": 7 } },
      { id: "goal-redness", label: "Crvenilo i reakcije", scores: { "mirna-barijera": 7 } },
      { id: "goal-dryness", label: "Suvoća i zategnutost", scores: { "duboka-hidratacija": 7 } },
      { id: "goal-spots", label: "Fleke i tragovi", scores: { "ujednacen-ten": 7 } },
      { id: "goal-lines", label: "Fine linije i tekstura", scores: { "age-support": 7 } },
      { id: "goal-glow", label: "Umoran ten bez sjaja", scores: { "ujednacen-ten": 4, balans: 3 } },
    ],
  },
  {
    id: "sensitivity",
    title: "Koliko lako tvoja koža reaguje?",
    helper: "Peckanje, uporno crvenilo i svrab računaju se kao reakcija.",
    type: "single",
    required: true,
    answers: [
      { id: "sensitivity-high", label: "Često reaguje", scores: { "mirna-barijera": 5, "duboka-hidratacija": 1 } },
      { id: "sensitivity-sometimes", label: "Ponekad, uz jače proizvode", scores: { "mirna-barijera": 2, balans: 1 } },
      { id: "sensitivity-low", label: "Retko ili nikada", scores: { balans: 2, "cista-koza": 1, "age-support": 1 } },
    ],
  },
  {
    id: "experience",
    title: "Koliko iskustva imaš sa aktivnim sastojcima?",
    helper: "Aktivi uključuju kiseline, retinoide i koncentrovane tretmane.",
    type: "single",
    required: true,
    answers: [
      { id: "experience-new", label: "Početnik/ca sam", scores: { balans: 2, "mirna-barijera": 1 } },
      { id: "experience-some", label: "Koristim ih povremeno", scores: { "ujednacen-ten": 1, "cista-koza": 1 } },
      { id: "experience-advanced", label: "Imam stabilnu aktivnu rutinu", scores: { "age-support": 2, "cista-koza": 1 } },
    ],
  },
  {
    id: "routine-length",
    title: "Koliko koraka realno želiš da koristiš?",
    helper: "Bolja je kratka rutina koju pratiš nego duga koju preskačeš.",
    type: "single",
    required: true,
    answers: [
      { id: "length-three", label: "Do 3 koraka", scores: { balans: 3, "mirna-barijera": 1 } },
      { id: "length-four", label: "3–4 koraka", scores: { "duboka-hidratacija": 1, "ujednacen-ten": 1 } },
      { id: "length-five", label: "Želim kompletnu rutinu", scores: { "age-support": 1, "cista-koza": 1 } },
    ],
  },
  {
    id: "spf-habit",
    title: "Koliko često trenutno koristiš SPF?",
    helper: "Odgovor ne menja dijagnozu, ali menja savet uz rutinu.",
    type: "single",
    required: true,
    answers: [
      { id: "spf-daily", label: "Svakog dana", scores: { balans: 1 } },
      { id: "spf-sometimes", label: "Samo kada je sunčano", scores: {} },
      { id: "spf-never", label: "Gotovo nikada", scores: {} },
    ],
  },
  {
    id: "pregnancy",
    title: "Da li si trudna, dojiš ili trenutno izbegavaš retinoide?",
    helper: "Ovo pitanje služi da iz rezultata isključimo retinal.",
    type: "single",
    required: true,
    answers: [
      { id: "pregnancy-yes", label: "Da", scores: { "mirna-barijera": 1, "ujednacen-ten": 1 } },
      { id: "pregnancy-no", label: "Ne", scores: { "age-support": 1 } },
      { id: "pregnancy-unsure", label: "Nisam siguran/na", scores: { balans: 1 } },
    ],
  },
];

export const routinePriority: readonly RoutineId[] = [
  "mirna-barijera",
  "cista-koza",
  "duboka-hidratacija",
  "ujednacen-ten",
  "age-support",
  "balans",
];

const answerLookup: ReadonlyMap<string, QuizAnswer> = new Map(
  quizQuestions.flatMap((question) => question.answers.map((answer) => [answer.id, answer] as const)),
);

export function recommendRoutine(answerIds: readonly string[]): QuizRecommendation {
  const uniqueAnswerIds = [...new Set(answerIds)];
  const scores = Object.fromEntries(routinePriority.map((routineId) => [routineId, 0])) as Record<RoutineId, number>;

  uniqueAnswerIds.forEach((answerId) => {
    const answer = answerLookup.get(answerId);
    if (!answer) return;

    Object.entries(answer.scores).forEach(([routineId, points]) => {
      scores[routineId as RoutineId] += points ?? 0;
    });
  });

  const routineId = routinePriority.reduce((best, candidate) =>
    scores[candidate] > scores[best] ? candidate : best,
  );

  const excludedProductIds: ProductId[] = [];
  const safetyMessages: string[] = [];

  if (uniqueAnswerIds.includes("pregnancy-yes") || uniqueAnswerIds.includes("pregnancy-unsure")) {
    excludedProductIds.push("al-retinal-emulsion");
    safetyMessages.push("Iz preporuke smo isključili retinal. Za izbor aktivne nege u trudnoći ili tokom dojenja konsultuj lekara.");
  }

  if (!uniqueAnswerIds.includes("spf-daily")) {
    safetyMessages.push("Za rezultate i prevenciju novih promena uvedi SPF kao poslednji jutarnji korak.");
  }

  if (uniqueAnswerIds.includes("sensitivity-high")) {
    safetyMessages.push("Nove proizvode uvodi jedan po jedan i prvo testiraj na manjoj regiji kože.");
  }

  return { routineId, scores, answerIds: uniqueAnswerIds, excludedProductIds, safetyMessages };
}
