import type { CommunityPost, Course } from "./types";

export const courses: readonly Course[] = [
  {
    id: "course-barrier-reset",
    slug: "skin-barrier-reset",
    title: "Skin Barrier Reset",
    eyebrow: "Flagship program · 14 dana",
    description: "Prepoznaj signale preopterećene kože, napravi minimalnu rutinu i postepeno vrati aktive bez nagađanja.",
    outcome: "Na kraju programa imaćeš održivu AM/PM rutinu i jasan plan za narednih 30 dana.",
    instructor: "dr Mina Petrović",
    instructorRole: "dermatolog i EQUA edukator",
    level: "početni",
    priceRsd: 0,
    image: "/images/campaign/equa-ritual-hero.jpg",
    accent: "#d9ef72",
    featured: true,
    includedWith: ["tc-barrier-serum", "tc-ceramide-cream"],
    modules: [
      {
        id: "read-signals",
        title: "01 · Pročitaj signale",
        summary: "Razlikuj suvoću, dehidrataciju i narušenu barijeru.",
        lessons: [
          {
            id: "lesson-barrier-basics",
            slug: "sta-je-kozna-barijera",
            title: "Šta je kožna barijera i zašto reaguje",
            summary: "Kratka mapa kože: šta je štiti i kako izgleda kada je preopterećena.",
            durationMinutes: 8,
            preview: true,
            image: "/images/campaign/equa-ritual-hero.jpg",
            productIds: ["tc-centella-cleanser", "tc-barrier-serum"],
            chapters: [{ time: "00:00", label: "Kako radi barijera" }, { time: "02:40", label: "Pet signala" }, { time: "05:35", label: "Prva 72 sata" }],
            checklist: ["Zabeleži kada koža pecka", "Pauziraj nove aktive", "Fotografiši početno stanje u dnevnom svetlu"],
            transcript: ["Kožna barijera nije trend, već sistem koji zadržava vlagu i smanjuje prodor iritansa.", "Kada peckanje traje i uz blagu negu, cilj nije dodavanje još jednog seruma — cilj je smanjiti broj promenljivih."],
          },
          {
            id: "lesson-dry-vs-dehydrated",
            slug: "suva-ili-dehidrirana-koza",
            title: "Suva, dehidrirana ili iritirana?",
            summary: "Tri slična osećaja traže različite odluke.",
            durationMinutes: 10,
            preview: true,
            image: "/images/products/serum.jpg",
            productIds: ["nordica-ha-serum", "tc-barrier-serum"],
            chapters: [{ time: "00:00", label: "Brzi test" }, { time: "03:15", label: "Voda naspram lipida" }, { time: "07:20", label: "Kada stati" }],
            checklist: ["Proceni zatezanje posle umivanja", "Proveri da li se koža istovremeno masti", "Ne menjaj više stvari odjednom"],
            transcript: ["Dehidratacija je stanje nedostatka vode i može se pojaviti kod svakog tipa kože.", "Suvoj koži nedostaje lipida, dok iritirana koža traži smanjenje opterećenja."],
          },
        ],
      },
      {
        id: "rebuild",
        title: "02 · Ponovo izgradi osnovu",
        summary: "Tri koraka koja vraćaju predvidljivost rutini.",
        lessons: [
          {
            id: "lesson-cleanse",
            slug: "ciscenje-bez-zatezanja",
            title: "Čišćenje bez zatezanja",
            summary: "Kako da proceniš da li čistač radi više nego što treba.",
            durationMinutes: 7,
            preview: false,
            image: "/images/products/cleanser.jpg",
            productIds: ["tc-centella-cleanser", "dn-gentle-cleanser"],
            chapters: [{ time: "00:00", label: "Količina" }, { time: "02:10", label: "Temperatura vode" }, { time: "04:50", label: "Znaci prejakog čišćenja" }],
            checklist: ["Umivanje traje do 60 sekundi", "Koristi mlaku vodu", "Koža posle brisanja ne sme da zateže"],
            transcript: ["Dobar čistač uklanja naslage, ali ne ostavlja osećaj škripave čistoće.", "Ako koža zateže odmah nakon umivanja, formula ili tehnika verovatno su preagresivne."],
          },
          {
            id: "lesson-hydration-layers",
            slug: "slojevi-hidratacije",
            title: "Slojevi hidratacije koji imaju smisla",
            summary: "Humektans, emolijens i okluziv — bez komplikovanja.",
            durationMinutes: 11,
            preview: false,
            image: "/images/products/cream.jpg",
            productIds: ["nordica-ha-serum", "tc-ceramide-cream", "b8-panthenol-balm"],
            chapters: [{ time: "00:00", label: "Tri uloge" }, { time: "04:05", label: "Redosled" }, { time: "08:30", label: "Kako prilagoditi teksturu" }],
            checklist: ["Serum nanesi na blago vlažnu kožu", "Zaključaj vlagu kremom", "Balzam koristi samo gde je potreban"],
            transcript: ["Hidratacija nije jedan sastojak, već odnos vode i lipida.", "Lagana tekstura ide prva, a krema pomaže da se vlaga zadrži."],
          },
          {
            id: "lesson-spf",
            slug: "spf-kao-poslednji-korak",
            title: "SPF kao poslednji korak oporavka",
            summary: "Količina, nanošenje i obnavljanje bez pillinga.",
            durationMinutes: 9,
            preview: false,
            image: "/images/products/spf.jpg",
            productIds: ["tc-mineral-spf50", "lumen-invisible-spf50"],
            chapters: [{ time: "00:00", label: "Zašto svaki dan" }, { time: "03:20", label: "Količina" }, { time: "06:15", label: "Pilling" }],
            checklist: ["Nanesi kao poslednji jutarnji korak", "Ne mešaj sa kremom", "Obnovi tokom dužeg boravka napolju"],
            transcript: ["SPF ne popravlja barijeru direktno, ali smanjuje dodatni stres tokom oporavka.", "Najbolji je onaj koji možeš da naneseš u dovoljnoj količini svakog jutra."],
          },
        ],
      },
      {
        id: "maintain",
        title: "03 · Vrati aktive bez straha",
        summary: "Plan za povratak tretmana i prepoznavanje konflikata.",
        lessons: [
          {
            id: "lesson-reintroduce",
            slug: "povratak-aktivnih-sastojaka",
            title: "Povratak aktivnih sastojaka",
            summary: "Jedan aktiv, dva puta nedeljno, uz jasne stop-signale.",
            durationMinutes: 12,
            preview: false,
            image: "/images/products/treatment.jpg",
            productIds: ["lumen-niacinamide-serum", "dn-azelaic-serum"],
            chapters: [{ time: "00:00", label: "Kada je koža spremna" }, { time: "04:30", label: "Raspored" }, { time: "09:10", label: "Stop-signali" }],
            checklist: ["Uvedi samo jedan aktiv", "Počni dva puta nedeljno", "Vrati se osnovi ako crvenilo traje"],
            transcript: ["Aktiv vraćamo tek kada osnovna rutina više ne pecka.", "Rezultat dolazi iz doslednosti, ne iz najveće moguće koncentracije."],
          },
          {
            id: "lesson-plan-30",
            slug: "tvoj-plan-za-30-dana",
            title: "Tvoj plan za narednih 30 dana",
            summary: "Pretvori znanje u raspored koji možeš da pratiš.",
            durationMinutes: 8,
            preview: false,
            image: "/images/campaign/equa-ritual-hero.jpg",
            productIds: ["tc-barrier-serum", "tc-ceramide-cream", "tc-mineral-spf50"],
            chapters: [{ time: "00:00", label: "Nedelja 1" }, { time: "02:15", label: "Nedelja 2" }, { time: "05:20", label: "Nedelje 3 i 4" }],
            checklist: ["Izaberi datum početka", "Napravi fotografiju jednom nedeljno", "Menjaj samo jednu promenljivu"],
            transcript: ["Plan od 30 dana nije izazov savršenstva već način da vidiš šta zaista radi.", "Jednom nedeljno zabeleži osećaj, crvenilo i zatezanje."],
          },
        ],
      },
    ],
  },
  {
    id: "course-retinal",
    slug: "retinal-bez-straha",
    title: "Retinal bez straha",
    eyebrow: "Masterclass · 46 min",
    description: "Jasan raspored uvođenja retinala, kombinacije koje imaju smisla i signali kada treba usporiti.",
    outcome: "Imaćeš personalizovan četvoronedeljni raspored i stabilnu prateću rutinu.",
    instructor: "Jelena Ilić",
    instructorRole: "magistar farmacije",
    level: "srednji",
    priceRsd: 2490,
    image: "/images/products/treatment.jpg",
    accent: "#c7b2f2",
    featured: true,
    includedWith: ["al-retinal-emulsion"],
    modules: [{ id: "retinal-start", title: "01 · Bezbedan početak", summary: "Od nule do održivog ritma.", lessons: [
      { id: "lesson-retinal-map", slug: "retinal-mapa", title: "Retinoidna mapa", summary: "Retinol, retinal i receptorske opcije — bez konfuzije.", durationMinutes: 11, preview: true, image: "/images/products/treatment.jpg", productIds: ["al-retinal-emulsion", "tc-ceramide-cream"], chapters: [{ time: "00:00", label: "Porodica retinoida" }, { time: "04:00", label: "Kome odgovara" }, { time: "08:20", label: "Kontraindikacije" }], checklist: ["Proveri trudnoću/dojenje", "Stabilizuj osnovnu rutinu", "Izaberi dve večeri nedeljno"], transcript: ["Retinal je moćan alat, ali nije obavezna stanica svake rutine.", "U trudnoći i tokom dojenja retinoidi se ne koriste." ] },
      { id: "lesson-retinal-schedule", slug: "raspored-cetiri-nedelje", title: "Raspored za prve četiri nedelje", summary: "Tempo, sandwich metod i stop-signali.", durationMinutes: 14, preview: false, image: "/images/products/cream.jpg", productIds: ["al-retinal-emulsion", "al-peptide-cream", "lumen-invisible-spf50"], chapters: [{ time: "00:00", label: "Nedelje 1–2" }, { time: "05:20", label: "Nedelje 3–4" }, { time: "10:40", label: "Kada usporiti" }], checklist: ["Količina zrna graška", "Nanesi na suvu kožu", "SPF svakog jutra"], transcript: ["Počni jednom do dva puta nedeljno.", "Povećaj učestalost samo ako nema upornog peckanja i perutanja." ] },
    ] }],
  },
  {
    id: "course-glow",
    slug: "glow-bez-preterivanja",
    title: "Glow bez preterivanja",
    eyebrow: "Mini kurs · 32 min",
    description: "Vitamin C, niacinamid i SPF složeni u jednostavnu jutarnju rutinu.",
    outcome: "Znaćeš da izabereš jedan antioksidans i izbegneš dupliranje sastojaka.",
    instructor: "Lara Nikolić",
    instructorRole: "skin edukator",
    level: "početni",
    priceRsd: 1490,
    image: "/images/products/serum.jpg",
    accent: "#ffd3a7",
    featured: false,
    modules: [{ id: "glow-base", title: "01 · Jutarnja logika", summary: "Manje slojeva, bolji redosled.", lessons: [
      { id: "lesson-glow-order", slug: "redosled-za-glow", title: "Redosled za glow", summary: "Antioksidans, hidratacija i zaštita.", durationMinutes: 9, preview: true, image: "/images/products/serum.jpg", productIds: ["al-vitamin-c-serum", "lumen-brightening-cream", "lumen-invisible-spf50"], chapters: [{ time: "00:00", label: "Tri cilja" }, { time: "03:10", label: "Redosled" }, { time: "06:20", label: "Kako izbeći pilling" }], checklist: ["Izaberi jedan glavni serum", "Sačekaj da se sloj rasporedi", "SPF uvek poslednji"], transcript: ["Glow nije rezultat najvećeg broja aktivnih sastojaka.", "Jedan antioksidans, dovoljno hidratacije i dosledan SPF čine održivu osnovu." ] },
    ] }],
  },
] as const;

export const communitySeedPosts: readonly CommunityPost[] = [
  { id: "post-1", spaceId: "skin-barrier-reset", authorName: "Mila R.", authorRole: "član · 8. dan", title: "Kada ste vratili niacinamid posle resetovanja?", body: "Peckanje je stalo posle šest dana. Da li da sačekam punih 14 ili mogu ranije da probam jednom?", replies: 7, likes: 18, createdAt: "Danas · 09:24", tags: ["barijera", "niacinamid"] },
  { id: "post-2", spaceId: "skin-barrier-reset", authorName: "dr Mina Petrović", authorRole: "EQUA ekspert", title: "Nedeljni check-in: šta je danas mirnije?", body: "Napišite jednu stvar koja se poboljšala i jednu koja je još nejasna. Odgovaram večeras od 19h.", replies: 24, likes: 61, createdAt: "Juče · 17:10", tags: ["expert-q&a", "check-in"] },
  { id: "post-3", spaceId: "retinal-bez-straha", authorName: "Sara V.", authorRole: "član · modul 1", title: "Sandwich metoda mi je promenila iskustvo", body: "Prvi put nemam perutanje posle retinala. Ostajem na dve večeri još dve nedelje.", replies: 11, likes: 42, createdAt: "Pre 2 dana", tags: ["retinal", "napredak"] },
];

export const courseBySlug = Object.fromEntries(courses.map((course) => [course.slug, course])) as Record<string, Course>;

export function findLesson(courseSlug: string, lessonSlug: string) {
  const course = courseBySlug[courseSlug];
  if (!course) return null;
  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find((candidate) => candidate.slug === lessonSlug);
    if (lesson) return { course, module: courseModule, lesson };
  }
  return null;
}

export function courseLessonCount(course: Course) {
  return course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
}

export function courseDuration(course: Course) {
  return course.modules.reduce((sum, module) => sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.durationMinutes, 0), 0);
}
