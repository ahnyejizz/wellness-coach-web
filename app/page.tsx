import { auth } from "@/auth";

import HomeHeader from "./components/home/home-header";
import HomeOverviewSection from "./components/home/home-overview-section";
import HomeCoachArea, {
  type HomeCoachAreaItem,
} from "./components/home/home-coach-area";
import HomeFocusBoard from "./components/home/home-focus-board";
import HomeCoachPlanner from "./components/home/home-coach-planner";
import HomeDayPlan, {
  type HomeDayPlanItem,
} from "./components/home/home-day-plan";
import HomeWeeklyReport, {
  type HomeReportMetric,
  type HomeWeeklyBalanceItem,
} from "./components/home/home-weekly-report";
import HomeStartCoach from "./components/home/home-start-coach";

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

        <HomeFocusBoard />
        <HomeCoachPlanner />

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <HomeDayPlan dayPlan={dayPlan} />
          <HomeWeeklyReport
            reportMetrics={reportMetrics}
            weeklyBalance={weeklyBalance}
            reportNotes={reportNotes}
          />
        </section>

        <HomeStartCoach />
      </main>
    </div>
  );
}
