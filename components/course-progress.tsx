"use client";

import Link from "next/link";
import { Check, Play } from "lucide-react";
import type { Course } from "@/lib/data/types";
import { useLearning } from "./learning-store";

export function CourseProgress({ course, compact = false }: { course: Course; compact?: boolean }) {
  const { completedLessonIds } = useLearning();
  const lessons = course.modules.flatMap((module) => module.lessons);
  const completeCount = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const percent = lessons.length ? Math.round(completeCount / lessons.length * 100) : 0;
  const next = lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? lessons[0];

  return (
    <div className={`course-progress ${compact ? "course-progress--compact" : ""}`}>
      <div><span>{completeCount}/{lessons.length} lekcija</span><strong>{percent}%</strong></div>
      <i><b style={{ width: `${percent}%` }} /></i>
      {!compact && next && <Link className="text-link" href={`/academy/${course.slug}/${next.slug}`}>{percent ? "Nastavi gde si stao/la" : "Pokreni prvu lekciju"} <Play size={14} /></Link>}
    </div>
  );
}

export function LessonStatus({ lessonId }: { lessonId: string }) {
  const { isComplete } = useLearning();
  return isComplete(lessonId) ? <span className="lesson-status is-done"><Check size={12} /> završeno</span> : null;
}
