export const staticPageContract = [
  { path: "/", name: "homepage" },
  { path: "/shop", name: "shop" },
  { path: "/journal", name: "journal" },
  { path: "/ingredients", name: "ingredient atlas" },
  { path: "/quiz", name: "skin quiz" },
  { path: "/routine", name: "routine builder" },
  { path: "/cart", name: "cart" },
  { path: "/account", name: "account" },
  { path: "/admin", name: "admin" },
  { path: "/academy", name: "academy" },
  { path: "/community", name: "community" },
];

export const dynamicPageContract = [
  {
    name: "product detail",
    linkPattern: /href=["'](\/product\/[^"'#?]+)["']/gi,
    discoveryPaths: ["/shop", "/"],
  },
  {
    name: "journal article",
    linkPattern: /href=["'](\/journal\/[^"'#?]+)["']/gi,
    discoveryPaths: ["/journal", "/"],
  },
  {
    name: "concern detail",
    linkPattern: /href=["'](\/concerns\/[^"'#?]+)["']/gi,
    discoveryPaths: ["/", "/shop", "/quiz"],
  },
  {
    name: "course detail",
    linkPattern: /href=["'](\/academy\/(?![^"']+\/)[^"'#?]+)["']/gi,
    discoveryPaths: ["/academy", "/"],
  },
  {
    name: "course lesson",
    linkPattern: /href=["'](\/academy\/[^"'#?]+\/[^"'#?]+)["']/gi,
    discoveryPaths: ["/academy/skin-barrier-reset"],
  },
];

export const contentMinimums = {
  productLinks: 4,
  journalLinks: 2,
  concernLinks: 3,
};

export const starterResiduePatterns = [
  /Your site is taking shape/i,
  /Building your site/i,
  /codex-preview/i,
  /_sites-preview/i,
];
