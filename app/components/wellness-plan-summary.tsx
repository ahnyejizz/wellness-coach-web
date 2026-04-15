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
    <section className="panel rounded-[2rem] px-6 py-7 sm:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Linked plan
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            홈에서 만든 개인 플랜이 코치 공간에도 이어집니다
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Zustand로 관리하는 플랜 상태를 기반으로, 최근 저장한 목표와 루틴
            방향을 코치 페이지에서도 바로 확인할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <span className="rounded-full border border-[var(--border)] bg-white/72 px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
            현재 포커스: {getFocusLabel(activeFocus)}
          </span>
          <Link
            href="/#coach-board"
            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
          >
            홈에서 플랜 수정하기
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-white/72 px-5 py-4">
        <p className="text-sm text-[var(--muted)]">{summaryLabel}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
          <p className="text-sm text-[var(--muted)]">플랜 이름</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {getPlannerDisplayName(profile.name)}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {getGoalLabel(profile.goal)}
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
          <p className="text-sm text-[var(--muted)]">수면 · 운동</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {profile.bedtime}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            주 {profile.workoutDays}회 운동 루틴
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
          <p className="text-sm text-[var(--muted)]">영양 목표</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {profile.proteinTarget}g / {profile.waterTarget.toFixed(1)}L
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            단백질과 수분 목표가 연결돼 있어요
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
          <p className="text-sm text-[var(--muted)]">식사 스타일</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {getMealPatternLabel(profile.mealPattern)}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            우선 코칭 축은 {getFocusLabel(profile.focus)} 기준입니다
          </p>
        </article>
      </div>
    </section>
  );
}
