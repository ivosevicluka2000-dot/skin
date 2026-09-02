import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonExperience } from "@/components/lesson-experience";
import { courses, findLesson } from "@/lib/data";

export function generateStaticParams() { return courses.flatMap((course) => course.modules.flatMap((module) => module.lessons.map((lesson) => ({ slug: course.slug, lesson: lesson.slug })))); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lesson: string }> }): Promise<Metadata> { const { slug, lesson } = await params; const found = findLesson(slug, lesson); return found ? { title: `${found.lesson.title} · ${found.course.title}`, description: found.lesson.summary } : { title: "Lekcija" }; }

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) { const { slug, lesson } = await params; const found = findLesson(slug, lesson); if (!found) notFound(); return <LessonExperience course={found.course} lesson={found.lesson} />; }
