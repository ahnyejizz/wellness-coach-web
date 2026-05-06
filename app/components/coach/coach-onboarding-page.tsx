import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import { auth } from "@/auth";
import { WELLNESS_COLORS } from "@/app/constants/colors";
import { saveOnboardingAnswers } from "@/app/coach/onboarding/actions";
import { HomeIcon, WeightIcon, SleepIcon, WorkoutIcon, MealIcon, type IconProps } from "@/app/components/icon/icon";
import { getFinalUserProfileByEmail } from "@/lib/auth/onboarding-cookie-store";
import {
  exerciseExperienceOptions,
  hasCompletedOnboarding,
  mealStyleOptions,
  sleepPatternOptions,
} from "@/lib/auth/user-store";

const defaultCallbackUrl = "/";
type OnboardingFieldKey = "goalWeightKg" | "sleepPattern" | "exerciseExperience" | "mealStyle";
type OnboardingFieldMeta = {
  label: string;
  summary: string;
  accent: string;
  softAccent: string;
  icon: ComponentType<IconProps>;
};

const onboardingFieldOrder: OnboardingFieldKey[] = ["goalWeightKg", "sleepPattern", "exerciseExperience", "mealStyle"];

const onboardingFieldMeta = {
  goalWeightKg: {
    label: "목표 체중",
    summary: "감량, 유지, 증량 방향의 기준점",
    accent: "var(--accent-strong)",
    softAccent: "var(--accent-soft)",
    icon: WeightIcon,
  },
  sleepPattern: {
    label: "수면 패턴",
    summary: "루틴 설계와 회복 우선순위 반영",
    accent: WELLNESS_COLORS.sleep.accent,
    softAccent: WELLNESS_COLORS.sleep.softAccent,
    icon: SleepIcon,
  },
  exerciseExperience: {
    label: "운동 경험",
    summary: "강도와 빈도를 무리 없이 시작",
    accent: WELLNESS_COLORS.exercise.accent,
    softAccent: WELLNESS_COLORS.exercise.softAccent,
    icon: WorkoutIcon,
  },
  mealStyle: {
    label: "식단 스타일",
    summary: "식사 제안의 톤과 현실성 맞춤",
    accent: WELLNESS_COLORS.diet.accent,
    softAccent: WELLNESS_COLORS.diet.softAccent,
    icon: MealIcon,
  },
} satisfies Record<OnboardingFieldKey, OnboardingFieldMeta>;

function OnboardingFieldHeading({
  field,
  variant = "field",
}: {
  field: OnboardingFieldKey;
  variant?: "field" | "card";
}) {
  const { accent, softAccent, icon: Icon, label } = onboardingFieldMeta[field];
  const labelClassName =
    variant === "card" ? "text-xl font-semibold tracking-tight text-[var(--foreground)]" : "ui-field-label";

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)]"
        style={{
          backgroundColor: softAccent,
          color: accent,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className={labelClassName}>{label}</span>
    </div>
  );
}

/**
 * @description 웰니스 프로필을 받아 이후 코칭 개인화 기준으로 저장하는 코치 온보딩 페이지
 */
function getQueryValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? (value[0] ?? "") : "";
}

function normalizeCallbackUrl(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return defaultCallbackUrl;
  }

  if (value.startsWith("/login") || value.startsWith("/signup") || value.startsWith("/coach/onboarding")) {
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

  const localProfile = await getFinalUserProfileByEmail(session.user.email);

  if (!localProfile) {
    redirect("/signup");
  }

  const searchParams = await props.searchParams;
  const callbackUrl = normalizeCallbackUrl(getQueryValue(searchParams.callbackUrl) || defaultCallbackUrl);
  const mode = getQueryValue(searchParams.mode) === "edit" ? "edit" : "setup";

  if (hasCompletedOnboarding(localProfile) && mode !== "edit") {
    redirect(callbackUrl);
  }

  const errorMessage = resolveErrorMessage(getQueryValue(searchParams.error));
  const goalWeightValue =
    getQueryValue(searchParams.goalWeightKg) ||
    (typeof localProfile.goalWeightKg === "number" ? localProfile.goalWeightKg.toString() : "");
  const sleepPatternValue = getQueryValue(searchParams.sleepPattern) || localProfile.sleepPattern || "";
  const exerciseExperienceValue =
    getQueryValue(searchParams.exerciseExperience) || localProfile.exerciseExperience || "";
  const mealStyleValue = getQueryValue(searchParams.mealStyle) || localProfile.mealStyle || "";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[100rem] items-center px-5 py-8 sm:px-8 lg:px-10">
      <div className="grid w-full gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <section className="panel panel-strong ui-panel-shell-lg">
          <p className="ui-kicker">{mode === "edit" ? "Edit Wellness Profile" : "Welcome Wellness Profile"}</p>
          <h1 className="ui-title-4 mt-3">
            {mode === "edit"
              ? "웰니스 프로필을 다시 조정해볼까요?"
              : `${localProfile.name}님에게 맞는 시작점을 알려주세요.`}
          </h1>
          <p className="ui-copy mt-4 max-w-3xl sm:text-base">
            목표 체중, 수면 패턴, 운동 경험, 식단 스타일을 먼저 확인하면 코칭 플로우를 더 개인화할 수 있습니다.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {onboardingFieldOrder.map((field) => {
              const meta = onboardingFieldMeta[field];

              return (
                <article key={field} className="ui-card">
                  <OnboardingFieldHeading field={field} variant="card" />
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{meta.summary}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel ui-panel-shell-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="ui-kicker tracking-[0.24em]">
                {mode === "edit" ? "Onboarding Update" : "Onboarding Create"}
              </p>
              <h2 className="ui-title-3 mt-3">{mode === "edit" ? "온보딩 수정" : "온보딩 입력"}</h2>
            </div>
            <Link
              href={mode === "edit" ? callbackUrl : "/"}
              aria-label={mode === "edit" ? "돌아가기" : "홈으로"}
              title={mode === "edit" ? "돌아가기" : "홈으로"}
              className="ui-pill inline-flex items-center justify-center px-3"
            >
              {mode === "edit" ? "돌아가기" : <HomeIcon />}
            </Link>
          </div>

          <form action={saveOnboardingAnswers} className="mt-8 space-y-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <input type="hidden" name="mode" value={mode === "edit" ? "edit" : ""} />

            {errorMessage ? <div className="ui-alert">{errorMessage}</div> : null}

            <label className="block">
              <OnboardingFieldHeading field="goalWeightKg" />
              <div className="ui-field-shell">
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
              <OnboardingFieldHeading field="sleepPattern" />
              <select required name="sleepPattern" defaultValue={sleepPatternValue} className="ui-field-control">
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
              <OnboardingFieldHeading field="exerciseExperience" />
              <select
                required
                name="exerciseExperience"
                defaultValue={exerciseExperienceValue}
                className="ui-field-control"
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
              <OnboardingFieldHeading field="mealStyle" />
              <select required name="mealStyle" defaultValue={mealStyleValue} className="ui-field-control">
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

            <button type="submit" className="ui-submit-button">
              {mode === "edit" ? "온보딩 저장하기" : "온보딩 완료하고 코치 시작하기"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
