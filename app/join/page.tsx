import type { Metadata } from "next";
import { MemberJoinExperience } from "@/components/member-join-experience";

export const metadata: Metadata = { title: "Postani EQUA član", description: "Jedan nalog za Skin Blueprint, Akademiju, rutinu i EQUA Club." };

function safeReturnTo(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <MemberJoinExperience returnTo={safeReturnTo(returnTo)} />;
}
