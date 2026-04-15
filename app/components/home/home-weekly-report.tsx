export type HomeReportMetric = {
  label: string;
  value: string;
  delta: string;
  accent: string;
};

export type HomeWeeklyBalanceItem = {
  day: string;
  score: number;
};

type HomeWeeklyReportProps = {
  reportMetrics: HomeReportMetric[];
  weeklyBalance: HomeWeeklyBalanceItem[];
  reportNotes: string[];
};

export default function HomeWeeklyReport({
  reportMetrics,
  weeklyBalance,
  reportNotes,
}: HomeWeeklyReportProps) {
  return (
    <article
      id="report"
      className="panel panel-strong rounded-[2rem] px-6 py-7 sm:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Weekly report
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            주간 건강 리포트
          </h2>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)]">
          지난 7일 종합 밸런스
        </span>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {reportMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-4"
          >
            <p className="text-sm text-[var(--muted)]">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {metric.value}
            </p>
            <p className="mt-2 text-sm" style={{ color: metric.accent }}>
              {metric.delta}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/72 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--muted)]">
              Balance score trend
            </p>
            <span className="text-sm text-[var(--accent-strong)]">+19 this week</span>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-3">
            {weeklyBalance.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-3">
                <div className="flex h-44 w-full items-end rounded-[1.1rem] bg-[rgba(22,48,43,0.08)] p-1">
                  <div
                    className="w-full rounded-[0.9rem] bg-[var(--foreground)]"
                    style={{ height: `${day.score}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[var(--foreground)]">
                    {day.day}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{day.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/72 p-5">
          <p className="text-sm font-medium text-[var(--muted)]">
            코치가 읽은 이번 주 변화
          </p>
          <div className="mt-5 space-y-3">
            {reportNotes.map((note) => (
              <div
                key={note}
                className="rounded-[1.25rem] border border-[var(--border)] bg-white px-4 py-4"
              >
                <p className="text-sm leading-7 text-[var(--foreground)]">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
