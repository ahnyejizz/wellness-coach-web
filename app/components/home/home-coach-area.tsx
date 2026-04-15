type HomeCoachAreaItem = {
  title: string;
  subtitle: string;
  summary: string;
  accent: string;
  softAccent: string;
  bullets: string[];
};

const coachAreas: HomeCoachAreaItem[] = [
  {
    title: "Sleep Coach",
    subtitle: "깊게 자고 가볍게 깨는 리듬",
    summary: "취침 시간, 야간 각성, 스크린 타임을 함께 읽어 회복 중심의 수면 루틴을 설계합니다.",
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
    bullets: ["취침 전 30분 회복 루틴", "수면 부채 추적", "아침 각성 리듬 코칭"],
  },
  {
    title: "Workout Coach",
    subtitle: "무리 없이 쌓이는 운동 습관",
    summary: "오늘의 컨디션과 피로도를 반영해 강도, 시간, 회복 밸런스를 자동으로 제안합니다.",
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
    bullets: ["근력 + 유산소 균형", "회복일 제안", "주간 훈련량 리포트"],
  },
  {
    title: "Nutrition Coach",
    subtitle: "에너지가 오래 가는 식사 설계",
    summary: "단백질, 수분, 식사 간격을 중심으로 식단을 관리해 과식과 피로를 줄여줍니다.",
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
    bullets: ["식사 타이밍 최적화", "단백질 목표 추적", "점심 이후 집중력 관리"],
  },
];

export default function HomeCoachArea() {
  return (
    <section id="coach-areas" className="grid gap-5 md:grid-cols-3">
      {coachAreas.map((coachArea) => (
        <article key={coachArea.title} className="panel ui-panel-card">
          <div
            className="mb-5 inline-flex rounded-full px-3 py-1 text-sm font-semibold"
            style={{
              backgroundColor: coachArea.softAccent,
              color: coachArea.accent,
            }}
          >
            {coachArea.title}
          </div>
          <h2 className="ui-title-2">{coachArea.subtitle}</h2>
          <p className="ui-copy mt-4">{coachArea.summary}</p>

          <div className="mt-6 space-y-3">
            {coachArea.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--border)] bg-white/72 px-4 py-3"
              >
                <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: coachArea.accent }} />
                <p className="text-sm leading-7 text-[var(--foreground)]">{bullet}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
