import type { Metadata } from "next";
import { CommunityExperience } from "@/components/community-experience";

export const metadata: Metadata = { title: "EQUA Club", description: "Diskusije vezane za programe, rutine i stvarna pitanja o nezi kože." };

export default function CommunityPage() { return <CommunityExperience />; }
