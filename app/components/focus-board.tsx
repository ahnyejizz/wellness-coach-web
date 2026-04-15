"use client";

import { useWellnessStore, type FocusKey } from "@/app/stores/wellness-store";

type FocusMetric = {
  label: string;
  value: string;
  hint: string;
};

type FocusPattern = {
  label: string;
  value: number;
  caption: string;
};

export type FocusArea = {
  label: string;
  kicker: string;
  headline: string;
  summary: string;
  score: string;
  scoreLabel: string;
  target: string;
  coachNote: string;
  habits: string[];
  metrics: FocusMetric[];
  patterns: FocusPattern[];
  accent: string;
  softAccent: string;
};

export type FocusAreaMap = Record<FocusKey, FocusArea>;

const focusOrder: FocusKey[] = ["sleep", "exercise", "diet"];

export default function FocusBoard({ areas }: { areas: FocusAreaMap }) {
  const activeFocus = useWellnessStore((state) => state.activeFocus);
  const setActiveFocus = useWellnessStore((state) => state.setActiveFocus);
  const current = areas[activeFocus];

  return (
    <section
      id="coach-board"
      className="grid gap-6 xl:grid-cols-[0.76fr_1.24fr]"
      aria-labelledby="coach-board-title"
    >
      <article className="panel rounded-[2rem] px-6 py-7 sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          Focus board
        </p>
        <h2
          id="coach-board-title"
          className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          오늘 가장 먼저 챙길 코칭 축을 선택하세요
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          수면, 운동, 식단 중 현재 우선순위를 바꾸면 코치의 제안과 이번 주
          패턴이 함께 업데이트됩니다. 플래너에서 고른 우선 코칭 축과도 실시간으로
          동기화됩니다.
        </p>

        <div className="mt-8 space-y-3">
          {focusOrder.map((key) => {
            const area = areas[key];
            const isActive = key === activeFocus;

            return (
              <button
                key={area.label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFocus(key)}
                className={`w-full rounded-[1.5rem] border p-5 text-left transition-all duration-200 ${
                  isActive
                    ? "border-transparent bg-[var(--foreground)] text-[#fffaf2] shadow-xl"
                    : "border-[var(--border)] bg-white/65 text-[var(--foreground)] hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-sm ${
                        isActive ? "text-white/70" : "text-[var(--muted)]"
                      }`}
                    >
                      {area.kicker}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {area.label}
                    </h3>
                    <p
                      className={`mt-3 text-sm leading-7 ${
                        isActive ? "text-white/80" : "text-[var(--muted)]"
                      }`}
                    >
                      {area.summary}
                    </p>
                  </div>
                  <div
                    className="rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.16)" : area.softAccent,
                      color: isActive ? "#fffaf2" : area.accent,
                    }}
                  >
                    {area.score}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </article>

      <article className="panel panel-strong rounded-[2rem] px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em]" style={{ color: current.accent }}>
              {current.headline}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {current.target}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {current.summary}
            </p>
          </div>

          <div
            className="rounded-[1.5rem] border border-[var(--border)] px-6 py-4 sm:min-w-[7rem]"
            style={{ backgroundColor: current.softAccent }}
          >
            <p className="text-base font-medium text-[var(--muted)]">{current.scoreLabel}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
              {current.score}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/72 p-5">
            <p className="text-sm font-medium text-[var(--muted)]">Coach note</p>
            <p className="mt-3 text-lg leading-8 text-[var(--foreground)]">
              {current.coachNote}
            </p>

            <div className="mt-6 space-y-3">
              {current.habits.map((habit) => (
                <div
                  key={habit}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--border)] bg-white px-4 py-3"
                >
                  <span
                    className="mt-1 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: current.accent }}
                  />
                  <p className="text-sm leading-7 text-[var(--foreground)]">{habit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {current.metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-4"
                >
                  <p className="text-sm text-[var(--muted)]">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: current.accent }}>
                    {metric.hint}
                  </p>
                </article>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/72 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--muted)]">이번 주 패턴</p>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: current.softAccent, color: current.accent }}
                >
                  live coach
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {current.patterns.map((pattern) => (
                  <div key={pattern.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--foreground)]">{pattern.label}</span>
                      <span className="text-[var(--muted)]">{pattern.caption}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[rgba(22,48,43,0.08)]">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${pattern.value}%`,
                          backgroundColor: current.accent,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
