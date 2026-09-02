import { courses } from "@/lib/data";
import { ApiValidationError, json, optionalBoundedInteger, readJsonObject, requiredString, routeError } from "@/lib/server/api";
import { eventStatement, getDatabase, stableId } from "@/lib/server/db";
import { resolveOwner } from "@/lib/server/owner";

const courseIds = new Set(courses.map((course) => course.id));
const lessonToCourse = new Map(courses.flatMap((course) => course.modules.flatMap((module) => module.lessons.map((lesson) => [lesson.id, course.id] as const))));

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const owner = await resolveOwner(url.searchParams.get("ownerId"));
    const database = await getDatabase();
    const [enrollments, progress, quiz] = await Promise.all([
      database.prepare("SELECT course_id AS courseId, status, created_at AS createdAt FROM course_enrollments WHERE owner_id = ? ORDER BY created_at DESC").bind(owner.ownerId).all(),
      database.prepare("SELECT course_id AS courseId, lesson_id AS lessonId, progress_seconds AS progressSeconds, completed, updated_at AS updatedAt FROM lesson_progress WHERE owner_id = ? ORDER BY updated_at DESC").bind(owner.ownerId).all(),
      database.prepare("SELECT id, routine_id AS routineId, routine_name AS routineName, primary_signal AS primarySignal, answers_json AS answersJson, created_at AS createdAt FROM quiz_results WHERE owner_id = ? ORDER BY created_at DESC LIMIT 1").bind(owner.ownerId).first(),
    ]);
    return json({ ok: true, enrollments: enrollments.results ?? [], progress: progress.results ?? [], quiz: quiz ?? null });
  } catch (error) { return routeError(error); }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJsonObject(request);
    const owner = await resolveOwner(body.ownerId);
    const action = requiredString(body.action, "action", 24);
    const database = await getDatabase();

    if (action === "enroll") {
      const courseId = requiredString(body.courseId, "courseId", 100);
      if (!courseIds.has(courseId)) throw new ApiValidationError("Unknown course.", "courseId");
      const id = stableId("enr");
      await database.batch([
        database.prepare(`INSERT INTO course_enrollments (id, owner_id, course_id, status) VALUES (?, ?, ?, 'active') ON CONFLICT(owner_id, course_id) DO UPDATE SET status = 'active', updated_at = CURRENT_TIMESTAMP`).bind(id, owner.ownerId, courseId),
        eventStatement(database, "course.enrolled", "course", courseId, { ownerType: owner.authenticated ? "user" : "guest" }),
      ]);
      return json({ ok: true, enrollment: { courseId, status: "active" } }, 201);
    }

    if (action === "complete") {
      const courseId = requiredString(body.courseId, "courseId", 100);
      const lessonId = requiredString(body.lessonId, "lessonId", 100);
      if (!courseIds.has(courseId) || lessonToCourse.get(lessonId) !== courseId) throw new ApiValidationError("Lesson does not belong to this course.", "lessonId");
      const progressSeconds = optionalBoundedInteger(body.progressSeconds, "progressSeconds", 0, 86_400, 0);
      await database.batch([
        database.prepare(`INSERT INTO course_enrollments (id, owner_id, course_id, status) VALUES (?, ?, ?, 'active') ON CONFLICT(owner_id, course_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP`).bind(stableId("enr"), owner.ownerId, courseId),
        database.prepare(`INSERT INTO lesson_progress (id, owner_id, course_id, lesson_id, progress_seconds, completed) VALUES (?, ?, ?, ?, ?, 1) ON CONFLICT(owner_id, lesson_id) DO UPDATE SET progress_seconds = excluded.progress_seconds, completed = 1, updated_at = CURRENT_TIMESTAMP`).bind(stableId("lpr"), owner.ownerId, courseId, lessonId, progressSeconds),
        eventStatement(database, "lesson.completed", "lesson", lessonId, { courseId }),
      ]);
      return json({ ok: true, progress: { courseId, lessonId, completed: true } }, 201);
    }

    if (action === "quiz") {
      const routineId = requiredString(body.routineId, "routineId", 80);
      const routineName = requiredString(body.routineName, "routineName", 120);
      const primarySignal = requiredString(body.primarySignal, "primarySignal", 160);
      if (!Array.isArray(body.answerIds) || body.answerIds.length < 5 || body.answerIds.length > 20 || body.answerIds.some((answer) => typeof answer !== "string" || answer.length > 100)) throw new ApiValidationError("answerIds must contain valid quiz answers.", "answerIds");
      const id = stableId("qzr");
      await database.batch([
        database.prepare("INSERT INTO quiz_results (id, owner_id, routine_id, routine_name, primary_signal, answers_json) VALUES (?, ?, ?, ?, ?, ?)").bind(id, owner.ownerId, routineId, routineName, primarySignal, JSON.stringify(body.answerIds)),
        eventStatement(database, "quiz.completed", "quiz_result", id, { routineId }),
      ]);
      return json({ ok: true, quiz: { id, routineId, routineName, primarySignal } }, 201);
    }

    throw new ApiValidationError("Unknown learning action.", "action");
  } catch (error) { return routeError(error); }
}
