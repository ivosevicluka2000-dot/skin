import type { Metadata } from "next";
import { MemberGate } from "@/components/member-gate";
import { ProgramLibrary } from "@/components/program-library";
import { courses } from "@/lib/data";

export const metadata: Metadata = { title: "Programi · EQUA Akademija", description: "Pretraži i filtriraj EQUA video programe prema nivou, trajanju i pristupu." };

export default function AcademyProgramsPage() {
  return <MemberGate returnTo="/academy/programs" area="academy"><ProgramLibrary courses={courses} /></MemberGate>;
}
