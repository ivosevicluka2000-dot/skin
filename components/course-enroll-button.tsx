"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import { useLearning } from "./learning-store";

export function CourseEnrollButton({ courseId, firstLessonHref, free }: { courseId: string; firstLessonHref: string; free: boolean }) {
  const { enroll, enrolledCourseIds } = useLearning();
  const enrolled = enrolledCourseIds.includes(courseId);

  if (enrolled) {
    return <Link className="button button--dark" href={firstLessonHref}><Play size={17} /> Nastavi kurs</Link>;
  }

  return (
    <button className="button button--dark" type="button" onClick={() => void enroll(courseId)}>
      {free ? <CheckCircle2 size={17} /> : <ArrowRight size={17} />}
      {free ? "Upiši besplatno" : "Kupi pristup"}
    </button>
  );
}
