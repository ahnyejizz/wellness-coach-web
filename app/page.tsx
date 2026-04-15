import Link from "next/link";

import { auth } from "@/auth";

import CoachPlanner from "./components/coach-planner";
import FocusBoard from "./components/focus-board";
import HomeCoachArea, {
  type HomeCoachAreaItem,
} from "./components/home-coach-area";
import HomeHeader from "./components/home-header";
import HomeOverviewSection from "./components/home-overview-section";

const coachAreas: HomeCoachAreaItem[] = [
  {
    title: "Sleep Coach",
    subtitle: "깊게 자고 가볍게 깨는 리듬",
    summary:
      "취침 시간, 야간 각성, 스크린 타임을 함께 읽어 회복 중심의 수면 루틴을 설계합니다.",
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
    bullets: ["취침 전 30분 회복 루틴", "수면 부채 추적", "아침 각성 리듬 코칭"],
  },
  {
    title: "Workout Coach",
    subtitle: "무리 없이 쌓이는 운동 습관",
    summary:
      "오늘의 컨디션과 피로도를 반영해 강도, 시간, 회복 밸런스를 자동으로 제안합니다.",
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
    bullets: ["근력 + 유산소 균형", "회복일 제안", "주간 훈련량 리포트"],
  },
  {
    title: "Nutrition Coach",
    subtitle: "에너지가 오래 가는 식사 설계",
    summary:
      "단백질, 수분, 식사 간격을 중심으로 식단을 관리해 과식과 피로를 줄여줍니다.",
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
    bullets: ["식사 타이밍 최적화", "단백질 목표 추적", "점심 이후 집중력 관리"],
  },
];

const dayPlan = [
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
    detail: "전신 근력 35분. 오늘은 하체 중심이지만 RPE 8을 넘기지 않도록 조절합니다.",
    domain: "운동",
    tint: "var(--mint-soft)",
    accent: "var(--mint)",
  },
  {
    time: "22:20",
    title: "Wind-down Routine",
    detail: "조명 낮추기, 스크린 종료, 가벼운 호흡으로 수면 진입을 부드럽게 만듭니다.",
    domain: "수면",
    tint: "var(--sky-soft)",
    accent: "var(--sky)",
  },
];

const reportMetrics = [
  { label: "평균 수면", value: "7h 28m", delta: "+42m", accent: "var(--sky)" },
  { label: "운동 완수", value: "4/5", delta: "+1 session", accent: "var(--mint)" },
  { label: "단백질 달성", value: "106g", delta: "+14g", accent: "var(--sun)" },
];

const weeklyBalance = [
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

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name?.trim() || "Motive Care Member";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
      >
        <div className="float-soft absolute left-[-8rem] top-12 h-64 w-64 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pulse-glow absolute right-[-7rem] top-20 h-72 w-72 rounded-full bg-[var(--sky-soft)] blur-3xl" />
        <div className="absolute bottom-24 left-[20%] h-56 w-56 rounded-full bg-[var(--sun-soft)] blur-3xl" />
        <div className="grid-wash absolute inset-x-6 top-28 h-[32rem] rounded-[2rem] opacity-25" />
      </div>

      <main className="relative mx-auto flex w-full max-w-[108rem] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <section className="panel panel-strong rise-in overflow-hidden rounded-[2rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <HomeHeader isLoggedIn={isLoggedIn} userName={userName} />
          <HomeOverviewSection isLoggedIn={isLoggedIn} />
        </section>

        <HomeCoachArea coachAreas={coachAreas} />

        <FocusBoard />

        <CoachPlanner />

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
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
        </section>

        <section className="panel panel-strong overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                Start coaching
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                수면, 운동, 식단이 서로 연결된
                <br />
                진짜 개인 건강 코치를 시작해보세요.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                기록을 많이 남기지 않아도 괜찮습니다. 
                <br />
                중요한 건 지금 몸 상태에서 가장 효과가 큰 행동 하나를 매일 이어가게 만드는 것입니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                회원가입하고 코칭 시작
              </a>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-white"
              >
                로그인
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
