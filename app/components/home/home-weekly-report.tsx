type HomeReportMetric = {
  label: string;
  value: string;
  delta: string;
  accent: string;
};

type HomeWeeklyBalanceItem = {
  day: string;
  score: number;
};

const reportMetrics: HomeReportMetric[] = [
  { label: "평균 수면", value: "7h 28m", delta: "+42m", accent: "var(--sky)" },
  { label: "운동 완수", value: "4/5", delta: "+1 session", accent: "var(--mint)" },
  { label: "단백질 달성", value: "106g", delta: "+14g", accent: "var(--sun)" },
];

const weeklyBalance: HomeWeeklyBalanceItem[] = [
  { day: "Mon", score: 71 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 74 },
  { day: "Thu", score: 83 },
  { day: "Fri", score: 87 },
  { day: "Sat", score: 81 },
  { day: "Sun", score: 90 },
];

const reportNotes = [
  "수면이 안정되자 운동 후 피로 회복 속도도 함께 좋아졌어요.",
  "아침 단백질 섭취가 늘면서 오후 당기는 간식 빈도가 줄었습니다.",
  "이번 주는 강도를 더 올리기보다 취침 시간을 고정하는 편이 전체 점수를 더 끌어올립니다.",
];

export default function HomeWeeklyReport() {
  return (
    <article id="report" className="panel panel-strong ui-panel-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="ui-kicker">Weekly report</p>
          <h2 className="ui-title-3 mt-3">주간 웰니스 리포트</h2>
        </div>
        <span className="ui-pill text-[var(--muted)]">지난 7일 종합 밸런스</span>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {reportMetrics.map((metric) => (
          <article key={metric.label} className="ui-card-compact">
            <p className="text-sm text-[var(--muted)]">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{metric.value}</p>
            <p className="mt-2 text-sm" style={{ color: metric.accent }}>
              {metric.delta}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="ui-card-raised">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--muted)]">Balance score trend</p>
            <span className="text-sm text-[var(--accent-strong)]">+19 this week</span>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-3">
            {weeklyBalance.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-3">
                <div className="flex h-44 w-full items-end rounded-[1.1rem] bg-[rgba(22,48,43,0.08)] p-1">
                  <div className="w-full rounded-[0.9rem] bg-[var(--foreground)]" style={{ height: `${day.score}%` }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[var(--foreground)]">{day.day}</p>
                  <p className="text-xs text-[var(--muted)]">{day.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ui-card-raised">
          <p className="text-sm font-medium text-[var(--muted)]">코치가 읽은 이번주 변화</p>
          <div className="mt-5 space-y-3">
            {reportNotes.map((note) => (
              <div key={note} className="ui-card-note">
                <p className="text-sm leading-7 text-[var(--foreground)]">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
