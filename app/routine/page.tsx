import type { Metadata } from "next";
import { RoutineBuilder } from "@/components/routine-builder";

export const metadata: Metadata = { title: "Moja rutina", description: "Tvoj prilagodljiv AM i PM plan nege kože." };
export default function RoutinePage() { return <RoutineBuilder />; }
