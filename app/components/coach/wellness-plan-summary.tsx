"use client";

import Link from "next/link";

import {
  getFocusLabel,
  getGoalLabel,
  getMealPatternLabel,
  getPlannerDisplayName,
  getSavedPlanLabel,
  useWellnessStore,
} from "@/app/stores/wellness-store";

export default function WellnessPlanSummary() {
  const profile = useWellnessStore((state) => state.profile);
  const activeFocus = useWellnessStore((state) => state.activeFocus);
  const lastSavedAt = useWellnessStore((state) => state.lastSavedAt);
  const hasHydrated = useWellnessStore((state) => state.hasHydrated);
  const summaryLabel = getSavedPlanLabel(lastSavedAt, hasHydrated);

  return (
    <section className="panel ui-panel-shell">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="ui-kicker">Linked plan</p>
          <h2 className="ui-title-3 mt-3">홈에서 만든 개인 플랜이 코치 공간에도 이어집니다.</h2>
          <p className="ui-copy mt-4">
            플랜 상태를 기반으로, 최근 저장한 목표와 루틴 방향을 코치 페이지에서도 바로 확인할 수 있습니다.
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{summaryLabel}</p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <span className="ui-pill-static">현재 포커스: {getFocusLabel(activeFocus)}</span>
          <Link href="/#coach-board" className="ui-button-primary ui-button-primary-compact">
            홈에서 플랜 수정하기
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="ui-card">
          <p className="text-sm text-[var(--muted)]">플랜 이름</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {getPlannerDisplayName(profile.name)}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">{getGoalLabel(profile.goal)}</p>
        </article>

        <article className="ui-card">
          <p className="text-sm text-[var(--muted)]">수면 · 운동</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{profile.bedtime}</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">주 {profile.workoutDays}회 운동 루틴</p>
        </article>

        <article className="ui-card">
          <p className="text-sm text-[var(--muted)]">영양 목표</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {profile.proteinTarget}g / {profile.waterTarget.toFixed(1)}L
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">단백질과 수분 목표가 연결돼 있어요.</p>
        </article>

        <article className="ui-card">
          <p className="text-sm text-[var(--muted)]">식사 스타일</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {getMealPatternLabel(profile.mealPattern)}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">우선 코칭은 {getFocusLabel(profile.focus)} 기준입니다.</p>
        </article>
      </div>
    </section>
  );
}
