"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type EquaMember = {
  id: string;
  name: string;
  email: string;
  source: "chatgpt" | "mvp";
};

type MemberContextValue = {
  member: EquaMember | null;
  checking: boolean;
  register: (input: { name: string; email: string }) => EquaMember;
  signOutDemoMember: () => void;
};

const MemberContext = createContext<MemberContextValue | null>(null);
const STORAGE_KEY = "equa-member-v1";

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<EquaMember | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    async function hydrateMember() {
      try {
        const response = await fetch("/api/member", { cache: "no-store" });
        if (response.ok) {
          const payload = await response.json() as { member?: EquaMember };
          if (payload.member && active) {
            setMember(payload.member);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.member));
            return;
          }
        }
      } catch {
        // The local MVP can still use its device-level member preview.
      } finally {
        if (active) {
          try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) setMember(JSON.parse(saved) as EquaMember);
          } catch {
            window.localStorage.removeItem(STORAGE_KEY);
          }
          setChecking(false);
        }
      }
    }
    void hydrateMember();
    return () => { active = false; };
  }, []);

  const register = useCallback((input: { name: string; email: string }) => {
    const next: EquaMember = {
      id: `member-${crypto.randomUUID()}`,
      name: input.name.trim(),
      email: input.email.trim().toLocaleLowerCase("sr-Latn"),
      source: "mvp",
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setMember(next);
    return next;
  }, []);

  const signOutDemoMember = useCallback(() => {
    if (member?.source === "chatgpt") return;
    window.localStorage.removeItem(STORAGE_KEY);
    setMember(null);
  }, [member]);

  const value = useMemo(() => ({ member, checking, register, signOutDemoMember }), [checking, member, register, signOutDemoMember]);
  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}

export function useMember() {
  const value = useContext(MemberContext);
  if (!value) throw new Error("useMember must be used within MemberProvider");
  return value;
}
