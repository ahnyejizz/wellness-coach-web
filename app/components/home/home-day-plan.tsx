type HomeDayPlanItem = {
  time: string;
  title: string;
  detail: string;
  domain: string;
  tint: string;
  accent: string;
};

const dayPlan: HomeDayPlanItem[] = [
  {
    time: "07:00",
    title: "Wake + Light",
    detail: "기상 직후 물 한 컵과 10분 햇빛 노출로 수면 리듬을 정돈합니다.",
    domain: "수면",
    tint: "var(--sky-soft)",
    accent: "var(--sky)",
  },
  {
    time: "08:00",
    title: "Protein-first Breakfast",
    detail: "계란, 요거트, 두유처럼 단백질이 있는 아침으로 포만감을 먼저 만듭니다.",
    domain: "식단",
    tint: "var(--sun-soft)",
    accent: "var(--sun)",
  },
  {
    time: "12:40",
    title: "Post-lunch Walk",
    detail: "점심 후 15분 걷기로 소화와 오후 집중력을 함께 챙깁니다.",
    domain: "운동",
    tint: "var(--mint-soft)",
    accent: "var(--mint)",
  },
  {
    time: "18:30",
    title: "Strength Session",
    detail:
      "전신 근력 35분. 오늘은 하체 중심이지만 RPE 8을 넘기지 않도록 조절합니다.",
    domain: "운동",
    tint: "var(--mint-soft)",
    accent: "var(--mint)",
  },
  {
    time: "22:20",
    title: "Wind-down Routine",
    detail:
      "조명 낮추기, 스크린 종료, 가벼운 호흡으로 수면 진입을 부드럽게 만듭니다.",
    domain: "수면",
    tint: "var(--sky-soft)",
    accent: "var(--sky)",
  },
];

export default function HomeDayPlan() {
  return (
    <article className="panel rounded-[2rem] px-6 py-7 sm:px-8">
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
        Day plan
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        하루를 코칭 단위로 쪼갠 플로우
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        건강은 한번의 의지보다 시간대별 작은 행동이 이어질 때 바뀝니다.
        <br />
        기상, 식사, 움직임, 취침을 하나의 루프로 설계했습니다.
      </p>

      <div className="mt-8 space-y-4">
        {dayPlan.map((item) => (
          <article
            key={item.time}
            className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ backgroundColor: item.tint, color: item.accent }}
                >
                  {item.time}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                      {item.title}
                    </h3>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: item.tint,
                        color: item.accent,
                      }}
                    >
                      {item.domain}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}
