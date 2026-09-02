import type { Metadata } from "next";
import { QuizExperience } from "@/components/quiz-experience";

export const metadata: Metadata = { title: "Skin check", description: "Odgovori na 9 pitanja i složi personalizovanu AM/PM rutinu." };
export default function QuizPage() { return <QuizExperience />; }
