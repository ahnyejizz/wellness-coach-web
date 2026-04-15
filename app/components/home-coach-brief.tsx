const todayChecklist = [
  "22:20 디지털 셧다운으로 수면 질 확보",
  "점심 식사에 단백질 30g 이상 채우기",
  "퇴근 후 하체 근력 35분, 마지막 세트만 강도 상승",
];

const briefScores = [
  {
    label: "수면",
    value: "89",
    tint: "var(--sky-soft)",
  },
  {
    label: "운동",
    value: "4/5",
    tint: "var(--mint-soft)",
  },
  {
    label: "식단",
    value: "91%",
    tint: "var(--sun-soft)",
  },
];

export default function HomeCoachBrief() {
  return (
    <aside className="panel-dark rise-in-delay relative rounded-[1.9rem] px-6 py-7 text-[#f6f0e6] sm:px-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-white/70">
            Today&apos;s brief
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            오늘의 코치 브리핑
          </h2>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
          live
        </div>
      </div>

      <div className="mt-7 rounded-[1.6rem] border border-white/10 bg-white/8 p-5">
        <p className="text-sm text-white/70">핵심 포커스</p>
        <p className="mt-3 text-4xl font-semibold tracking-tight">
          Recovery First
        </p>
        <p className="mt-3 text-sm leading-7 text-white/80">
          어제 운동량은 충분했습니다. 오늘은 수면 질을 지키고 점심 이후
          걷기를 더해 에너지 흐름을 매끈하게 만드는 편이 좋아요.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {todayChecklist.map((item) => (
          <div
            key={item}
            className="rounded-[1.3rem] border border-white/10 bg-white/6 px-4 py-4"
          >
            <p className="text-sm leading-7 text-white/88">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
        {briefScores.map((score) => (
          <div
            key={score.label}
            className="rounded-[1.3rem] px-4 py-4 text-[var(--foreground)]"
            style={{ backgroundColor: score.tint }}
          >
            <p className="text-sm text-[var(--muted)]">{score.label}</p>
            <p className="mt-2 text-2xl font-semibold">{score.value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
