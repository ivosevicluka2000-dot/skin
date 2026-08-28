import type { Article } from "./types";

export const articles: readonly Article[] = [
  {
    id: "vodic-001",
    slug: "minimalna-rutina-zdrava-barijera",
    title: "Minimalna rutina za zdravu kožnu barijeru",
    eyebrow: "Počni od osnove",
    excerpt: "Tri dobro izabrana koraka često rade više od police pune aktivnih sastojaka.",
    category: "osnove-nege",
    author: "dr Mina Petrović",
    publishedAt: "2026-08-12",
    readingMinutes: 6,
    image: "/images/articles/minimalna-rutina.webp",
    featured: true,
    concernIds: ["osetljivost", "suvoca", "dehidratacija"],
    ingredientIds: ["ceramidi", "pantenol", "uv-filteri"],
    relatedProductIds: ["tc-centella-cleanser", "tc-ceramide-cream", "tc-mineral-spf50"],
    sections: [
      {
        heading: "Barijera je tvoj prvi filter",
        paragraphs: [
          "Kožna barijera zadržava vlagu i štiti kožu od spoljašnjih nadražaja. Kada je oslabljena, čak i blag proizvod može da pecka, a koža deluje suvo, crveno ili preosetljivo.",
          "Zato početna rutina ne mora da bude ambiciozna: nežan čistač, krema sa lipidima i svakodnevni SPF stvaraju stabilnu osnovu za sve što dolazi kasnije.",
        ],
        callout: "Ako svaki novi proizvod pecka, napravi pauzu od aktivnih sastojaka sedam do četrnaest dana.",
      },
      {
        heading: "Kako da uvodiš proizvode",
        paragraphs: [
          "Uvedi samo jedan novi proizvod u isto vreme i posmatraj kožu nekoliko dana. Tako ćeš lakše razumeti šta joj prija, a šta ne.",
          "Aktivni tretman dodaj tek kada osnovna rutina više ne izaziva zatezanje ili nelagodu.",
        ],
      },
    ],
  },
  {
    id: "vodic-002",
    slug: "niacinamid-sta-radi-i-kome-treba",
    title: "Niacinamid: šta zaista radi i kome treba?",
    eyebrow: "Sastojak bez hajpa",
    excerpt: "Zašto je vitamin B3 toliko svestran — i zašto viša koncentracija nije uvek bolja.",
    category: "sastojci",
    author: "Jelena Ilić, farmaceut",
    publishedAt: "2026-08-06",
    readingMinutes: 7,
    image: "/images/articles/niacinamid-vodic.webp",
    featured: true,
    concernIds: ["akne", "hiperpigmentacija", "bez-sjaja"],
    ingredientIds: ["niacinamid"],
    relatedProductIds: ["lumen-niacinamide-serum", "dn-azelaic-serum", "lumen-brightening-cream"],
    sections: [
      {
        heading: "Jedan sastojak, više uloga",
        paragraphs: [
          "Niacinamid podržava sintezu lipida u koži, pomaže ravnomernijem izgledu tena i može da doprinese kontroli viška sebuma.",
          "Koncentracija od oko pet procenata je za većinu rutina sasvim dovoljna i često se bolje podnosi od agresivnijih formula.",
        ],
      },
      {
        heading: "Kako ga kombinovati",
        paragraphs: [
          "Dobro se slaže sa hidratantnim serumima, azelainskom kiselinom i većinom krema. Ako koristiš više proizvoda sa niacinamidom, proveri da li ti njihovo sabiranje izaziva crvenilo.",
        ],
        callout: "Više nije nužno bolje: biraj formulu prema celoj rutini, ne samo procentu na pakovanju.",
      },
    ],
  },
  {
    id: "vodic-003",
    slug: "kako-uvesti-retinal-bez-iritacije",
    title: "Kako da uvedeš retinal bez nepotrebne iritacije",
    eyebrow: "Večernja škola aktiva",
    excerpt: "Praktičan raspored za prve četiri nedelje, uz jasne znake kada treba usporiti.",
    category: "strucni-vodic",
    author: "dr Mina Petrović",
    publishedAt: "2026-07-29",
    readingMinutes: 8,
    image: "/images/articles/retinal-vodic.webp",
    featured: false,
    concernIds: ["prvi-znaci-starenja", "hiperpigmentacija", "akne"],
    ingredientIds: ["retinal", "ceramidi", "uv-filteri"],
    relatedProductIds: ["al-retinal-emulsion", "tc-ceramide-cream", "lumen-invisible-spf50"],
    sections: [
      {
        heading: "Počni sporije nego što misliš",
        paragraphs: [
          "Prve dve nedelje koristi retinal samo jednom ili dva puta nedeljno na potpuno suvoj koži. Količina veličine zrna graška dovoljna je za celo lice.",
          "Ako nema upornog crvenila, peckanja ili perutanja, treće i četvrte nedelje možeš preći na svako treće veče.",
        ],
        callout: "Retinoidi se ne koriste u trudnoći ili tokom dojenja. Za individualni savet obrati se lekaru.",
      },
      {
        heading: "Zaštiti rutinu",
        paragraphs: [
          "Krema sa ceramidima pre ili posle retinala može poboljšati podnošljivost. Svakodnevni SPF nije opcioni dodatak, već deo tretmana.",
        ],
      },
    ],
  },
  {
    id: "vodic-004",
    slug: "jutarnja-rutina-protiv-fleka",
    title: "Jutarnja rutina protiv fleka u četiri koraka",
    eyebrow: "Shop the routine",
    excerpt: "Antioksidans, hidratacija i dovoljno SPF-a: redosled koji se lako pamti.",
    category: "rutine",
    author: "Lara Nikolić, skin edukator",
    publishedAt: "2026-07-18",
    readingMinutes: 5,
    image: "/images/articles/jutarnja-rutina-fleke.webp",
    featured: true,
    concernIds: ["hiperpigmentacija", "bez-sjaja"],
    ingredientIds: ["vitamin-c", "niacinamid", "uv-filteri"],
    relatedProductIds: ["al-vitamin-c-serum", "lumen-brightening-cream", "lumen-invisible-spf50"],
    sections: [
      {
        heading: "Doslednost ispred intenziteta",
        paragraphs: [
          "Blago jutarnje čišćenje prati antioksidativni serum, lagana hidratacija i širokospektralna zaštita. SPF je korak koji sprečava da postojeće fleke postanu izraženije.",
          "Rezultate meri fotografijama u istom svetlu na svake četiri nedelje, a ne svakodnevnim gledanjem u ogledalo.",
        ],
      },
      {
        heading: "Koliko SPF-a je dovoljno?",
        paragraphs: [
          "Za lice i vrat koristi obilnu količinu i ne zaboravi uši i liniju kose. Tokom dužeg boravka napolju zaštitu treba obnoviti.",
        ],
        callout: "Najbolji SPF je onaj koji možeš da naneseš dovoljno i nosiš svakog dana.",
      },
    ],
  },
  {
    id: "vodic-005",
    slug: "dehidrirana-ili-suva-koza",
    title: "Dehidrirana ili suva koža? Nije isto.",
    eyebrow: "Nauči da čitaš kožu",
    excerpt: "Jednoj nedostaje voda, drugoj lipidi — a često se ova dva stanja preklapaju.",
    category: "osnove-nege",
    author: "Jelena Ilić, farmaceut",
    publishedAt: "2026-07-10",
    readingMinutes: 6,
    image: "/images/articles/suva-dehidrirana.webp",
    featured: false,
    concernIds: ["suvoca", "dehidratacija"],
    ingredientIds: ["hijaluronska-kiselina", "skvalan", "ceramidi"],
    relatedProductIds: ["nordica-ha-serum", "nordica-squalane-cream", "nordica-sleeping-mask"],
    sections: [
      {
        heading: "Stanje naspram tipa kože",
        paragraphs: [
          "Suva koža je tip kože koji prirodno proizvodi manje lipida. Dehidratacija je prolazno stanje nedostatka vode i može se javiti čak i kod masne kože.",
          "Ako koža istovremeno sija i zateže, verovatnije je da joj nedostaje voda nego dodatno odmašćivanje.",
        ],
      },
      {
        heading: "Slojevi koji rade zajedno",
        paragraphs: [
          "Hidratantni serum nanesi na blago vlažnu kožu, zatim dodaj kremu sa ceramidima ili skvalanom. Bez završnog emolijensa, voda se brže gubi.",
        ],
      },
    ],
  },
  {
    id: "vodic-006",
    slug: "salicilna-kiselina-vodic-za-pore",
    title: "Salicilna kiselina: vodič za čistije pore",
    eyebrow: "BHA bez grešaka",
    excerpt: "Kako da uvedeš eksfolijant, koliko često da ga koristiš i kada da napraviš pauzu.",
    category: "sastojci",
    author: "dr Mina Petrović",
    publishedAt: "2026-06-26",
    readingMinutes: 7,
    image: "/images/articles/salicilna-kiselina.webp",
    featured: false,
    concernIds: ["akne"],
    ingredientIds: ["salicilna-kiselina", "niacinamid"],
    relatedProductIds: ["dn-bha-toner", "dn-gentle-cleanser", "lumen-niacinamide-serum"],
    sections: [
      {
        heading: "Zašto BHA deluje u porama",
        paragraphs: [
          "Salicilna kiselina je rastvorljiva u mastima, pa može da deluje unutar pora u kojima se nakupljaju sebum i mrtve ćelije.",
          "Počni sa dva nanošenja nedeljno. Češća primena nije prečica ako dovede do iritacije i narušene barijere.",
        ],
      },
      {
        heading: "Kada usporiti",
        paragraphs: [
          "Uporno peckanje, sjajna zategnuta površina i perutanje su znaci da treba napraviti pauzu i vratiti se jednostavnoj nezi.",
        ],
        callout: "Ne uvodi salicilnu kiselinu i retinal iste nedelje ako ranije nisi koristio/la aktivne sastojke.",
      },
    ],
  },
  {
    id: "vodic-007",
    slug: "rutina-za-crvenilo-i-reaktivnost",
    title: "Rutina za crvenilo: manje proizvoda, jasniji signal",
    eyebrow: "Plan za reaktivne dane",
    excerpt: "Kako da smanjiš broj promenljivih i prepoznaš šta tvojoj koži zaista prija.",
    category: "rutine",
    author: "Lara Nikolić, skin edukator",
    publishedAt: "2026-06-14",
    readingMinutes: 5,
    image: "/images/articles/rutina-crvenilo.webp",
    featured: true,
    concernIds: ["crvenilo", "osetljivost"],
    ingredientIds: ["centela", "pantenol", "azelainska-kiselina"],
    relatedProductIds: ["tc-centella-cleanser", "tc-barrier-serum", "b8-panthenol-balm"],
    sections: [
      {
        heading: "Resetuj rutinu",
        paragraphs: [
          "Kada koža burno reaguje, privremeno zadrži samo blag čistač, umirujući serum, kremu i SPF. Na taj način lakše pratiš promene i smanjuješ mogućnost dodatne iritacije.",
          "Azelainsku kiselinu uvedi tek kada koža više ne pecka pri nanošenju osnovne nege.",
        ],
      },
      {
        heading: "Kada ne treba eksperimentisati",
        paragraphs: [
          "Iznenadno ili uporno crvenilo, otok i svrab zahtevaju savet zdravstvenog radnika, a ne još jedan kozmetički proizvod.",
        ],
        callout: "Sadržaj vodiča je edukativan i nije zamena za dijagnozu dermatologa.",
      },
    ],
  },
  {
    id: "vodic-008",
    slug: "redosled-proizvoda-u-rutini",
    title: "Kojim redosledom se nanose proizvodi?",
    eyebrow: "Sačuvaj ovu mapu",
    excerpt: "Jednostavno pravilo za tonik, serum, kremu i SPF — uz izuzetke koji imaju smisla.",
    category: "osnove-nege",
    author: "Zlatna Koka editorial",
    publishedAt: "2026-06-02",
    readingMinutes: 4,
    image: "/images/articles/redosled-rutine.webp",
    featured: false,
    concernIds: ["dehidratacija", "bez-sjaja", "prvi-znaci-starenja"],
    ingredientIds: ["hijaluronska-kiselina", "retinal", "uv-filteri"],
    relatedProductIds: ["dn-gentle-cleanser", "nordica-ha-serum", "tc-ceramide-cream", "lumen-invisible-spf50"],
    sections: [
      {
        heading: "Od laganog ka bogatijem",
        paragraphs: [
          "Posle čišćenja dolaze vodeni tonik ili esencija, zatim ciljani serum i krema. Ujutru SPF uvek ide poslednji pre šminke.",
          "Ne moraš čekati dugo između slojeva; dovoljno je da se prethodni proizvod rasporedi i prestane da klizi po koži.",
        ],
      },
      {
        heading: "Pravila imaju svrhu, ne kult",
        paragraphs: [
          "Retinal se nanosi na suvu kožu radi bolje podnošljivosti, dok hijaluronski serum voli blago vlažnu podlogu. Prati uputstvo konkretne formule kada odstupa od opšteg pravila.",
        ],
      },
    ],
  },
];
