"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type SkinBlueprint = {
  routineId: string;
  routineName: string;
  primarySignal: string;
  answerIds: string[];
  savedAt: string;
};

type LearningState = {
  ownerId: string;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  skinBlueprint: SkinBlueprint | null;
  enroll: (courseId: string) => Promise<void>;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
  saveBlueprint: (blueprint: Omit<SkinBlueprint, "savedAt">) => Promise<void>;
  isComplete: (lessonId: string) => boolean;
};

const LearningContext = createContext<LearningState | null>(null);
const STORAGE_KEY = "equa-learning-v1";

type StoredState = Pick<LearningState, "enrolledCourseIds" | "completedLessonIds" | "skinBlueprint">;

const emptyState: StoredState = { enrolledCourseIds: [], completedLessonIds: [], skinBlueprint: null };

export function LearningProvider({ children }: { children: ReactNode }) {
  const [ownerId, setOwnerId] = useState("");
  const [stored, setStored] = useState<StoredState>(emptyState);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const sessionId = window.localStorage.getItem("equa-session") ?? crypto.randomUUID();
      window.localStorage.setItem("equa-session", sessionId);
      setOwnerId(sessionId);
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setStored({ ...emptyState, ...(JSON.parse(raw) as StoredState) });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const persist = useCallback((next: StoredState) => {
    setStored(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const post = useCallback(async (body: Record<string, unknown>) => {
    if (!ownerId) return;
    const response = await fetch("/api/learning", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ownerId, ...body }),
    });
    if (!response.ok && response.status !== 503) throw new Error("Napredak trenutno nije moguće sačuvati.");
  }, [ownerId]);

  const enroll = useCallback(async (courseId: string) => {
    if (!stored.enrolledCourseIds.includes(courseId)) {
      persist({ ...stored, enrolledCourseIds: [...stored.enrolledCourseIds, courseId] });
    }
    await post({ action: "enroll", courseId });
  }, [persist, post, stored]);

  const completeLesson = useCallback(async (courseId: string, lessonId: string) => {
    if (!stored.completedLessonIds.includes(lessonId)) {
      persist({
        ...stored,
        enrolledCourseIds: stored.enrolledCourseIds.includes(courseId) ? stored.enrolledCourseIds : [...stored.enrolledCourseIds, courseId],
        completedLessonIds: [...stored.completedLessonIds, lessonId],
      });
    }
    await post({ action: "complete", courseId, lessonId, progressSeconds: 0 });
  }, [persist, post, stored]);

  const saveBlueprint = useCallback(async (blueprint: Omit<SkinBlueprint, "savedAt">) => {
    const nextBlueprint = { ...blueprint, savedAt: new Date().toISOString() };
    persist({ ...stored, skinBlueprint: nextBlueprint });
    await post({ action: "quiz", ...nextBlueprint });
  }, [persist, post, stored]);

  const value = useMemo<LearningState>(() => ({
    ownerId,
    enrolledCourseIds: stored.enrolledCourseIds,
    completedLessonIds: stored.completedLessonIds,
    skinBlueprint: stored.skinBlueprint,
    enroll,
    completeLesson,
    saveBlueprint,
    isComplete: (lessonId) => stored.completedLessonIds.includes(lessonId),
  }), [completeLesson, enroll, ownerId, saveBlueprint, stored]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error("useLearning must be used within LearningProvider");
  return value;
}
