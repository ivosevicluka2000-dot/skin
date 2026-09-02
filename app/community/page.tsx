import type { Metadata } from "next";
import { CommunityExperience } from "@/components/community-experience";
import { MemberGate } from "@/components/member-gate";

export const metadata: Metadata = { title: "EQUA Club", description: "Diskusije vezane za programe, rutine i stvarna pitanja o nezi kože." };

export default function CommunityPage() { return <MemberGate returnTo="/community" area="community"><CommunityExperience /></MemberGate>; }
