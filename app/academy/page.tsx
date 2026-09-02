import type { Metadata } from "next";
import { AcademyExperience } from "@/components/academy-experience";
import { courses } from "@/lib/data";

export const metadata: Metadata = { title: "EQUA Akademija", description: "Video programi koji znanje pretvaraju u rutinu koju možeš da pratiš." };

export default function AcademyPage() {
  return <AcademyExperience courses={courses} />;
}
