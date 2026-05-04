"use client";

import { useWellnessStore } from "@/app/stores/wellness-store";

import LockPreview from "../common/lock-preview";

import { focusAreas } from "./home-focus-board";

type HomePriorityProps = {
  isLoggedIn: boolean;
};

export default function HomePriority({ isLoggedIn }: HomePriorityProps) {
  const activeFocus = useWellnessStore((state) => state.activeFocus);
  const current = focusAreas[activeFocus];

  return (
    <article className="panel panel-strong ui-panel-shell">
      {isLoggedIn ? (
        <>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="ui-kicker">{current.headline}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                <h3 className="ui-title-3 shrink-0">이번주 목표:</h3>
                <p className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {current.target}
                </p>
              </div>
              <p className="ui-copy mt-4">{current.summary}</p>
            </div>

            <div
              className="rounded-[1.5rem] border border-[var(--border)] px-6 py-4 sm:min-w-[7rem]"
              style={{ backgroundColor: current.softAccent }}
            >
              <p className="text-base font-medium text-[var(--muted)]">{current.scoreLabel}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-[var(--foreground)]">{current.score}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.0fr_1.12fr]">
            <div className="ui-card-raised">
              <p className="text-sm font-medium text-[var(--muted)]">Coach note</p>
              <p className="mt-3 text-lg leading-8 text-[var(--foreground)]">{current.coachNote}</p>

              <div className="mt-6 space-y-3">
                {current.habits.map((habit) => (
                  <div key={habit} className="ui-card-note flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: current.accent }} />
                    <p className="text-sm leading-7 text-[var(--foreground)]">{habit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {current.metrics.map((metric) => (
                  <article key={metric.label} className="ui-card-compact">
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

              <div className="ui-card-raised">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--muted)]">이번주 패턴</p>
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
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl flex-1">
              <p className="ui-kicker">{current.headline}</p>
              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
                <h3 className="ui-title-3 shrink-0">이번주 목표:</h3>
                <LockPreview
                  className="flex-1"
                  accent={current.accent}
                  softAccent={current.softAccent}
                  lineWidths={["79%", "66%"]}
                  lineAlign="center"
                  boxClassName="px-4 py-3"
                  previewAreaClassName="flex min-h-[5rem] items-center justify-center"
                  lineClassName="h-2.5 rounded-full"
                  messageInside
                  messageClassName="mt-1 text-sm text-[var(--muted)]"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/76 px-6 py-4 sm:min-w-[7rem]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-[var(--muted)]">{current.scoreLabel}</p>
              </div>
              <LockPreview
                className="mt-4"
                accent={current.accent}
                softAccent={current.softAccent}
                lineWidths={["4rem"]}
                boxClassName="flex h-[4rem] items-center justify-center bg-white/70"
                messageClassName="mt-3 text-xs leading-5 text-[var(--muted)]"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="ui-card-raised">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--muted)]">Coach note</p>
              </div>
              <LockPreview
                className="mt-4"
                accent={current.accent}
                softAccent={current.softAccent}
                lineWidths={["92%", "85%", "68%"]}
                boxClassName="p-4 rounded-[1.3rem]"
                messageClassName="mt-3 text-sm text-[var(--muted)]"
              />

              <div className="mt-6 space-y-3">
                {current.habits.map((habit) => (
                  <div key={habit} className="ui-card-note flex items-start gap-3 opacity-70">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: current.accent }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 rounded-full" style={{ width: "82%", backgroundColor: current.softAccent }} />
                      <div className="h-3 rounded-full" style={{ width: "58%", backgroundColor: current.softAccent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {current.metrics.map((metric) => (
                  <article key={metric.label} className="ui-card-compact">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-[var(--muted)]">{metric.label}</p>
                    </div>
                    <LockPreview
                      className="mt-4"
                      accent={current.accent}
                      softAccent={current.softAccent}
                      lineWidths={["5rem"]}
                      boxClassName="flex h-20 items-center justify-center"
                      messageClassName="mt-3 text-xs leading-5 text-[var(--muted)]"
                    />
                  </article>
                ))}
              </div>

              <div className="ui-card-raised min-h-[18rem]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--muted)]">이번주 패턴</p>
                </div>

                <div className="mt-5 space-y-4">
                  {current.patterns.map((pattern) => (
                    <div key={pattern.label} className="opacity-72">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--foreground)]">{pattern.label}</span>
                        <span className="text-[var(--muted)]">로그인 후 확인</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[rgba(22,48,43,0.08)]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(28, Math.round(pattern.value * 0.55))}%`,
                            backgroundColor: current.softAccent,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
