"use client";

import Link from "next/link";
import { WELLNESS_COLORS } from "@/app/constants/colors";

import {
  getFocusLabel,
  getGoalLabel,
  getMealPatternLabel,
  getPlanDisplayName,
  type FocusKey,
  useWellnessStore,
} from "@/app/stores/wellness-store";

const focusBadgeTone = {
  sleep: {
    accent: WELLNESS_COLORS.sleep.accent,
    softAccent: WELLNESS_COLORS.sleep.softAccent,
  },
  exercise: {
    accent: WELLNESS_COLORS.exercise.accent,
    softAccent: WELLNESS_COLORS.exercise.softAccent,
  },
  diet: {
    accent: WELLNESS_COLORS.diet.accent,
    softAccent: WELLNESS_COLORS.diet.softAccent,
  },
} satisfies Record<FocusKey, { accent: string; softAccent: string }>;

export default function PlanSummary() {
  const profile = useWellnessStore((state) => state.profile);
  const activeFocus = useWellnessStore((state) => state.activeFocus);
  const displayName = getPlanDisplayName(profile.name);
  const planTitle = displayName || getGoalLabel(profile.goal);
  const activeFocusTone = focusBadgeTone[activeFocus];

  return (
    <section className="panel ui-panel-wrapper ui-hover-panel h-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="ui-kicker">Plan Priority</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="ui-title-3">선택하신 플랜 우선순위</h2>
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
              style={{
                backgroundColor: activeFocusTone.softAccent,
                color: activeFocusTone.accent,
              }}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: activeFocusTone.accent }}
              />
              {getFocusLabel(activeFocus)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3">
          <Link href="/plan" className="ui-button-primary ui-button-primary-compact">
            플랜 수정하기
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="ui-card ui-hover-card">
          <p className="text-sm text-[var(--muted)]">플랜 이름</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{planTitle}</h3>
          {displayName ? <p className="mt-2 text-sm text-[var(--muted)]">{getGoalLabel(profile.goal)}</p> : null}
        </article>

        <article className="ui-card ui-hover-card">
          <p className="text-sm text-[var(--muted)]">수면 · 운동</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{profile.bedtime}</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">주 {profile.workoutDays}회 운동 루틴</p>
        </article>

        <article className="ui-card ui-hover-card">
          <p className="text-sm text-[var(--muted)]">영양 목표</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {profile.proteinTarget}g / {profile.waterTarget.toFixed(1)}L
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">단백질과 수분 목표가 연결돼 있어요.</p>
        </article>

        <article className="ui-card ui-hover-card">
          <p className="text-sm text-[var(--muted)]">식사 스타일</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {getMealPatternLabel(profile.mealPattern)}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            이 플랜은 {getFocusLabel(profile.focus)} 우선순위로 맞춰져 있습니다.
          </p>
        </article>
      </div>
    </section>
  );
}
