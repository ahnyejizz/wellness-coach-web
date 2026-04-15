import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { saveOnboardingAnswers } from "@/app/coach/onboarding/actions";
import {
  exerciseExperienceOptions,
  getWellnessFocusLabel,
  hasCompletedOnboarding,
  mealStyleOptions,
  sleepPatternOptions,
  getUserProfileByEmail,
} from "@/lib/auth/user-store";

const defaultCallbackUrl = "/coach";

function getQueryValue(value: string | string[] | undefined) {
  return typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value[0] ?? ""
      : "";
}

function normalizeCallbackUrl(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return defaultCallbackUrl;
  }

  if (
    value.startsWith("/login") ||
    value.startsWith("/signup") ||
    value.startsWith("/coach/onboarding")
  ) {
    return defaultCallbackUrl;
  }

  return value;
}

function resolveErrorMessage(value: string) {
  const messageMap: Record<string, string> = {
    missing_fields: "네 가지 항목을 모두 입력해주세요.",
    invalid_goal_weight: "목표 체중은 35kg에서 250kg 사이로 입력해주세요.",
    invalid_sleep_pattern: "수면 패턴을 다시 선택해주세요.",
    invalid_exercise_experience: "운동 경험을 다시 선택해주세요.",
    invalid_meal_style: "식단 스타일을 다시 선택해주세요.",
  };

  return messageMap[value] ?? "";
}

export default async function CoachOnboardingPage(props: {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
    goalWeightKg?: string | string[];
    sleepPattern?: string | string[];
    exerciseExperience?: string | string[];
    mealStyle?: string | string[];
    mode?: string | string[];
  }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/coach/onboarding");
  }

  const localProfile = await getUserProfileByEmail(session.user.email);

  if (!localProfile) {
    redirect("/signup");
  }

  const searchParams = await props.searchParams;
  const callbackUrl = normalizeCallbackUrl(
    getQueryValue(searchParams.callbackUrl) || defaultCallbackUrl,
  );
  const mode = getQueryValue(searchParams.mode) === "edit" ? "edit" : "setup";

  if (hasCompletedOnboarding(localProfile) && mode !== "edit") {
    redirect(callbackUrl);
  }

  const errorMessage = resolveErrorMessage(getQueryValue(searchParams.error));
  const goalWeightValue =
    getQueryValue(searchParams.goalWeightKg) ||
    (typeof localProfile.goalWeightKg === "number"
      ? localProfile.goalWeightKg.toString()
      : "");
  const sleepPatternValue =
    getQueryValue(searchParams.sleepPattern) || localProfile.sleepPattern || "";
  const exerciseExperienceValue =
    getQueryValue(searchParams.exerciseExperience) ||
    localProfile.exerciseExperience ||
    "";
  const mealStyleValue =
    getQueryValue(searchParams.mealStyle) || localProfile.mealStyle || "";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[100rem] items-center px-5 py-8 sm:px-8 lg:px-10">
      <div className="grid w-full gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <section className="panel panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            {mode === "edit" ? "Edit onboarding" : "Welcome onboarding"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
            {mode === "edit"
              ? "건강 프로필을 다시 조정해볼까요?"
              : `${localProfile.name}님에게 맞는 시작점을 알려주세요.`}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            목표 체중, 수면 패턴, 운동 경험, 식단 스타일을 먼저 확인하면 코칭 플로우를 더 개인화할 수 있습니다. 
            <br />
            지금 고른 우선 코칭은{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {getWellnessFocusLabel(localProfile.focus)}
            </span>
            입니다.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
              <p className="text-sm text-[var(--muted)]">목표 체중</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                감량, 유지, 증량 방향의 기준점
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
              <p className="text-sm text-[var(--muted)]">수면 패턴</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                루틴 설계와 회복 우선순위 반영
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
              <p className="text-sm text-[var(--muted)]">운동 경험</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                강도와 빈도를 무리 없이 시작
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
              <p className="text-sm text-[var(--muted)]">식단 스타일</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                식사 제안의 톤과 현실성 맞춤
              </p>
            </article>
          </div>
        </section>

        <section className="panel rounded-[2rem] px-6 py-8 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent-strong)]">
                {mode === "edit" ? "Profile update" : "Step 1"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {mode === "edit" ? "온보딩 수정" : "가입 직후 온보딩"}
              </h2>
            </div>
            <Link
              href={mode === "edit" ? callbackUrl : "/"}
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-white"
            >
              {mode === "edit" ? "돌아가기" : "홈으로"}
            </Link>
          </div>

          <form action={saveOnboardingAnswers} className="mt-8 space-y-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <input
              type="hidden"
              name="mode"
              value={mode === "edit" ? "edit" : ""}
            />

            {errorMessage ? (
              <div className="rounded-[1.3rem] border border-[rgba(220,95,62,0.22)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--foreground)]">
                {errorMessage}
              </div>
            ) : null}

            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">
                목표 체중
              </span>
              <div className="mt-2 flex items-center gap-3 rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent-soft)]">
                <input
                  required
                  name="goalWeightKg"
                  type="number"
                  inputMode="decimal"
                  min="35"
                  max="250"
                  step="0.1"
                  defaultValue={goalWeightValue}
                  className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                  placeholder="예: 68"
                />
                <span className="text-sm font-medium text-[var(--muted)]">kg</span>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">
                수면 패턴
              </span>
              <select
                required
                name="sleepPattern"
                defaultValue={sleepPatternValue}
                className="mt-2 w-full rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[var(--accent-soft)]"
              >
                <option value="" disabled>
                  수면 패턴을 선택해주세요.
                </option>
                {sleepPatternOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">
                운동 경험
              </span>
              <select
                required
                name="exerciseExperience"
                defaultValue={exerciseExperienceValue}
                className="mt-2 w-full rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[var(--accent-soft)]"
              >
                <option value="" disabled>
                  운동 경험을 선택해주세요.
                </option>
                {exerciseExperienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">
                식단 스타일
              </span>
              <select
                required
                name="mealStyle"
                defaultValue={mealStyleValue}
                className="mt-2 w-full rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[var(--accent-soft)]"
              >
                <option value="" disabled>
                  식단 스타일을 선택해주세요.
                </option>
                {mealStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-[1.3rem] bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {mode === "edit" ? "온보딩 저장하기" : "온보딩 완료하고 코치 시작하기"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
