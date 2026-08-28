"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CommerceProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  color?: string;
  routineStep?: string;
};

export type CartLine = { product: CommerceProduct; quantity: number };
export type RoutineLine = { product: CommerceProduct; slot: "AM" | "PM" | "AM + PM" };

type CommerceContextValue = {
  cart: CartLine[];
  routine: RoutineLine[];
  wishlist: string[];
  cartOpen: boolean;
  routineOpen: boolean;
  cartCount: number;
  subtotal: number;
  addToCart: (product: CommerceProduct, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  addToRoutine: (product: CommerceProduct, slot?: RoutineLine["slot"]) => void;
  removeFromRoutine: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
  setCartOpen: (open: boolean) => void;
  setRoutineOpen: (open: boolean) => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);
const STORAGE_KEY = "equa-mvp-commerce";

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [routine, setRoutine] = useState<RoutineLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [routineOpen, setRoutineOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as {
            cart?: CartLine[];
            routine?: RoutineLine[];
            wishlist?: string[];
          };
          setCart(parsed.cart ?? []);
          setRoutine(parsed.routine ?? []);
          setWishlist(parsed.wishlist ?? []);
        }
      } catch {
        // A private browsing policy should never block the storefront.
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, routine, wishlist }));
    } catch {
      // The checkout API remains the durable source once an order is submitted.
    }
  }, [cart, routine, wishlist, hydrated]);

  const addToCart = useCallback((product: CommerceProduct, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.slug === product.slug);
      if (existing) {
        return current.map((line) =>
          line.product.slug === product.slug
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [...current, { product, quantity }];
    });
    setCartOpen(true);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((line) => line.product.slug !== slug));
      return;
    }
    setCart((current) =>
      current.map((line) =>
        line.product.slug === slug ? { ...line, quantity } : line,
      ),
    );
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((current) => current.filter((line) => line.product.slug !== slug));
  }, []);

  const addToRoutine = useCallback(
    (product: CommerceProduct, slot: RoutineLine["slot"] = "AM + PM") => {
      setRoutine((current) => {
        if (current.some((line) => line.product.slug === product.slug)) return current;
        return [...current, { product, slot }];
      });
      setRoutineOpen(true);
    },
    [],
  );

  const removeFromRoutine = useCallback((slug: string) => {
    setRoutine((current) => current.filter((line) => line.product.slug !== slug));
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }, []);

  const value = useMemo<CommerceContextValue>(
    () => ({
      cart,
      routine,
      wishlist,
      cartOpen,
      routineOpen,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
      addToCart,
      setQuantity,
      removeFromCart,
      addToRoutine,
      removeFromRoutine,
      toggleWishlist,
      setCartOpen,
      setRoutineOpen,
    }),
    [
      cart,
      routine,
      wishlist,
      cartOpen,
      routineOpen,
      addToCart,
      setQuantity,
      removeFromCart,
      addToRoutine,
      removeFromRoutine,
      toggleWishlist,
    ],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const value = useContext(CommerceContext);
  if (!value) throw new Error("useCommerce must be used inside CommerceProvider");
  return value;
}
