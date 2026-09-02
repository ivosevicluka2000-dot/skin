"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { articles, concerns, products } from "@/lib/data/catalog";
import { courses } from "@/lib/data";
import { useCommerce } from "./commerce-store";
import { ProductArt } from "./product-art";

const navigation = [
  { href: "/shop", label: "Prodavnica" },
  { href: "/academy", label: "Akademija" },
  { href: "/journal", label: "Vodiči" },
  { href: "/community", label: "Zajednica" },
  { href: "/quiz", label: "Skin check" },
];

function formatRsd(value: number) {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const {
    cart,
    routine,
    cartCount,
    subtotal,
    cartOpen,
    routineOpen,
    setCartOpen,
    setRoutineOpen,
    setQuantity,
    removeFromCart,
    removeFromRoutine,
  } = useCommerce();

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("sr-Latn");
    if (query.length < 2) return [];
    const productResults = products
      .filter((product) => `${product.name} ${product.shortDescription}`.toLocaleLowerCase("sr-Latn").includes(query))
      .map((product) => ({ href: `/product/${product.slug}`, label: product.name, type: "Proizvod" }));
    const concernResults = concerns
      .filter((concern) => `${concern.name} ${concern.shortDescription}`.toLocaleLowerCase("sr-Latn").includes(query))
      .map((concern) => ({ href: `/concerns/${concern.slug}`, label: concern.name, type: "Problem kože" }));
    const articleResults = articles
      .filter((article) => `${article.title} ${article.excerpt}`.toLocaleLowerCase("sr-Latn").includes(query))
      .map((article) => ({ href: `/journal/${article.slug}`, label: article.title, type: "Vodič" }));
    const courseResults = courses
      .filter((course) => `${course.title} ${course.description}`.toLocaleLowerCase("sr-Latn").includes(query))
      .map((course) => ({ href: `/academy/${course.slug}`, label: course.title, type: "Video program" }));
    return [...productResults, ...courseResults, ...concernResults, ...articleResults].slice(0, 8);
  }, [searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMobileOpen(false);
      setSearchOpen(false);
      setCartOpen(false);
      setRoutineOpen(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, setCartOpen, setRoutineOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const timer = window.setTimeout(() => mobileCloseRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
        setCartOpen(false);
        setRoutineOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen, setRoutineOpen]);

  return (
    <div className="site-frame">
      <div className="announcement">
        <span>Besplatna dostava za rutine preko 6.000 RSD</span>
        <span className="announcement__alt">Novi vodič: kako obnoviti kožnu barijeru</span>
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <button
            className="icon-button mobile-only"
            onClick={() => setMobileOpen(true)}
            aria-label="Otvori meni"
          >
            <Menu size={20} />
          </button>
          <Link className="wordmark" href="/" aria-label="EQUA početna">
            EQUA<span>°</span>
          </Link>
          <nav className="desktop-nav" aria-label="Glavna navigacija">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "is-active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="search-pill" onClick={() => setSearchOpen(true)}>
              <Search size={17} />
              <span>Pretraži</span>
              <kbd>⌘K</kbd>
            </button>
            <Link className="icon-button desktop-only" href="/account" aria-label="Nalog">
              <UserRound size={19} />
            </Link>
            <button
              className="routine-pill"
              onClick={() => setRoutineOpen(true)}
              aria-label={`Moja rutina, ${routine.length} proizvoda`}
            >
              <Sparkles size={16} />
              <span>Moja rutina</span>
              <b>{routine.length}</b>
            </button>
            <button
              className="icon-button bag-button"
              onClick={() => setCartOpen(true)}
              aria-label={`Korpa, ${cartCount} proizvoda`}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && <b>{cartCount}</b>}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="site-footer__lead">
          <p className="eyebrow">Pametnija nega, manje nagađanja.</p>
          <h2>Koža se menja. Tvoja rutina treba da je prati.</h2>
          <Link className="text-link text-link--light" href="/quiz">
            Uradi skin check <ArrowRight size={18} />
          </Link>
        </div>
        <div className="site-footer__grid">
          <Link className="wordmark wordmark--light" href="/">
            EQUA<span>°</span>
          </Link>
          <div>
            <strong>Istraži</strong>
            <Link href="/shop">Prodavnica</Link>
            <Link href="/academy">Akademija</Link>
            <Link href="/journal">Vodiči</Link>
            <Link href="/ingredients">Sastojci</Link>
          </div>
          <div>
            <strong>Pomoć</strong>
            <Link href="/account">Moj nalog</Link>
            <Link href="/community">EQUA Club</Link>
            <Link href="/cart">Dostava i plaćanje</Link>
            <a href="mailto:hello@equa.rs">Kontakt</a>
          </div>
          <div>
            <strong>Prati nas</strong>
            <span>Instagram · uskoro</span>
            <span>TikTok · uskoro</span>
            <Link href="/#newsletter">Newsletter</Link>
          </div>
        </div>
        <div className="site-footer__meta">
          <span>© 2026 EQUA Beauty</span>
          <span>Demo MVP · Beograd</span>
        </div>
      </footer>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobilna navigacija"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="drawer-head">
                <span className="wordmark">EQUA°</span>
                <button ref={mobileCloseRef} className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Zatvori meni">
                  <X size={20} />
                </button>
              </div>
              <nav className="mobile-menu__nav">
                {[{ href: "/", label: "Početna" }, ...navigation, { href: "/account", label: "Moj EQUA" }, { href: "/routine", label: "Moja rutina" }].map(
                  (item, index) => (
                    <Link key={item.href} href={item.href}>
                      <span>0{index + 1}</span>
                      {item.label}
                      <ChevronRight size={20} />
                    </Link>
                  ),
                )}
              </nav>
              <div className="mobile-menu__note">Besplatna dostava preko 6.000 RSD.</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Pretraga"
          >
            <div className="search-overlay__head">
              <span className="wordmark wordmark--light">EQUA°</span>
              <button className="icon-button icon-button--light" onClick={() => setSearchOpen(false)} aria-label="Zatvori pretragu">
                <X size={22} />
              </button>
            </div>
            <div className="search-overlay__body">
              <p className="eyebrow">Jedna pretraga. Cela rutina.</p>
              <label className="search-field">
                <Search size={28} />
                <input ref={searchInputRef} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Probaj „osetljiva koža“" aria-label="Pretraži proizvode i vodiče" />
              </label>
              {searchQuery.trim().length >= 2 ? (
                <div className="search-results" aria-live="polite">
                  <span>{searchResults.length ? `${searchResults.length} rezultata` : "Nema rezultata — probaj naziv sastojka ili problem kože."}</span>
                  {searchResults.map((result) => <Link href={result.href} key={`${result.type}-${result.href}`}><small>{result.type}</small><strong>{result.label}</strong><ArrowRight size={18} /></Link>)}
                </div>
              ) : <div className="search-suggestions">
                <div>
                  <span>Popularno</span>
                  <Link href="/concerns/osetljiva-koza">Osetljiva koža</Link>
                  <Link href="/ingredients">Niacinamid</Link>
                  <Link href="/shop">SPF za svaki dan</Link>
                </div>
                <div>
                  <span>Iz vodiča</span>
                  <Link href="/academy/skin-barrier-reset">Skin Barrier Reset</Link>
                  <Link href="/journal">Jutarnja rutina u četiri koraka</Link>
                </div>
              </div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title="Tvoja korpa" kicker={`${cartCount} proizvoda`}>
        {cart.length === 0 ? (
          <EmptyDrawer
            title="Korpa je još prazna."
            copy="Počni od proizvoda ili dopusti da skin check složi celu rutinu za tebe."
            href="/quiz"
            cta="Složi moju rutinu"
          />
        ) : (
          <>
            <div className="drawer-lines">
              {cart.map((line) => (
                <div className="drawer-line" key={line.product.slug}>
                  <ProductArt color={line.product.color} label={line.product.brand} compact />
                  <div className="drawer-line__copy">
                    <span>{line.product.brand}</span>
                    <strong>{line.product.name}</strong>
                    <small>{formatRsd(line.product.price)}</small>
                    <div className="quantity-control">
                      <button onClick={() => setQuantity(line.product.slug, line.quantity - 1)} aria-label="Smanji količinu">
                        <Minus size={13} />
                      </button>
                      <b>{line.quantity}</b>
                      <button onClick={() => setQuantity(line.product.slug, line.quantity + 1)} aria-label="Povećaj količinu">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <button className="line-remove" onClick={() => removeFromCart(line.product.slug)} aria-label="Ukloni iz korpe">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="drawer-checkout">
              <div><span>Ukupno</span><strong>{formatRsd(subtotal)}</strong></div>
              <Link className="button button--dark button--full" href="/cart">
                Nastavi na plaćanje <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </Drawer>

      <Drawer open={routineOpen} onClose={() => setRoutineOpen(false)} title="Moja rutina" kicker={`${routine.length}/4 koraka`}>
        {routine.length === 0 ? (
          <EmptyDrawer
            title="Tvoja polica čeka."
            copy="Dodaj proizvode dok istražuješ ili napravi personalizovanu rutinu za manje od dva minuta."
            href="/quiz"
            cta="Pokreni skin check"
          />
        ) : (
          <>
            <div className="routine-mini-grid">
              {["Čišćenje", "Tretman", "Hidratacija", "Zaštita"].map((step, index) => {
                const line = routine[index];
                return (
                  <div className={`routine-mini-step ${line ? "is-filled" : ""}`} key={step}>
                    <span>0{index + 1}</span>
                    {line ? (
                      <>
                        <ProductArt color={line.product.color} label={line.product.brand} compact />
                        <strong>{line.product.name}</strong>
                        <button onClick={() => removeFromRoutine(line.product.slug)} aria-label={`Ukloni ${line.product.name}`}>
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <small>{step}</small>
                    )}
                  </div>
                );
              })}
            </div>
            <Link className="button button--dark button--full drawer-routine-cta" href="/routine">
              Uredi celu rutinu <ArrowRight size={18} />
            </Link>
          </>
        )}
      </Drawer>
    </div>
  );
}

function Drawer({
  open,
  onClose,
  title,
  kicker,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="overlay-close" onClick={onClose} aria-label="Zatvori panel" />
          <motion.aside
            className="side-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 270 }}
          >
            <div className="drawer-head">
              <div><span>{kicker}</span><h2>{title}</h2></div>
              <button className="icon-button" onClick={onClose} aria-label="Zatvori panel"><X size={20} /></button>
            </div>
            <div className="side-drawer__content">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmptyDrawer({ title, copy, href, cta }: { title: string; copy: string; href: string; cta: string }) {
  return (
    <div className="empty-drawer">
      <span className="empty-drawer__orb"><Sparkles size={28} /></span>
      <h3>{title}</h3>
      <p>{copy}</p>
      <Link className="button button--dark" href={href}>{cta} <ArrowRight size={18} /></Link>
    </div>
  );
}
