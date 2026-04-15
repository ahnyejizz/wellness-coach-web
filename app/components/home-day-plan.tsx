export type HomeDayPlanItem = {
  time: string;
  title: string;
  detail: string;
  domain: string;
  tint: string;
  accent: string;
};

type HomeDayPlanProps = {
  dayPlan: HomeDayPlanItem[];
};

export default function HomeDayPlan({ dayPlan }: HomeDayPlanProps) {
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
