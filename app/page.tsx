import Link from "next/link";

import { auth, signOut } from "@/auth";

import CoachPlanner from "./components/coach-planner";
import FocusBoard, { type FocusAreaMap } from "./components/focus-board";

const heroSignals = [
  { label: "수면 회복 점수", value: "89", hint: "늦은 취침 2회만 줄여도 회복이 더 올라가요." },
  { label: "운동 계획 달성률", value: "4/5", hint: "근력 3회, 걷기 2회 루틴 유지 중" },
  { label: "식단 안정도", value: "91%", hint: "단백질과 수분 섭취가 꾸준해졌어요." },
];

const pillars = [
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

const focusAreas: FocusAreaMap = {
  sleep: {
    label: "수면 코칭",
    kicker: "깊은 회복과 일정한 기상",
    headline: "sleep priority",
    summary:
      "스크린 타임의 영향을 줄이고, 매일 비슷한 시간에 잠드는 패턴을 만드는 데 집중합니다.",
    score: "89",
    scoreLabel: "회복 점수",
    target: "이번 주 목표: 23:10 취침, 07:00 기상",
    coachNote:
      "최근 4일 중 3일은 수면 시간이 충분했어요. 이제 핵심은 잠드는 시간을 더 일정하게 고정하는 것입니다.",
    habits: [
      "22:20 이후 조명 낮추기와 알림 묶음 모드 켜기",
      "잠들기 2시간 전 과식 대신 따뜻한 차로 마무리하기",
      "기상 후 10분은 햇빛과 가벼운 걷기로 각성 리듬 만들기",
    ],
    metrics: [
      { label: "평균 수면", value: "7h 28m", hint: "지난주 대비 +42m" },
      { label: "깊은 수면", value: "1h 36m", hint: "회복 구간 안정화" },
      { label: "취침 일관성", value: "78%", hint: "다음 목표 85%" },
    ],
    patterns: [
      { label: "취침 준비 루틴", value: 82, caption: "주 6회 실행" },
      { label: "스크린 오프 성공", value: 68, caption: "평균 28분 단축" },
      { label: "기상 후 햇빛 노출", value: 74, caption: "주 5회 달성" },
    ],
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
  },
  exercise: {
    label: "운동 코칭",
    kicker: "강도와 회복의 균형",
    headline: "movement priority",
    summary:
      "근력 운동, 유산소, 회복일 배치를 함께 보면서 몸이 무너지지 않는 주간 운동 패턴을 만듭니다.",
    score: "4/5",
    scoreLabel: "주간 세션",
    target: "이번 주 목표: 근력 3회 + zone 2 유산소 2회",
    coachNote:
      "하체 세션 다음 날 피로도가 높게 나타나고 있어요. 볼륨을 조금 낮추고 회복 산책을 끼워 넣는 편이 좋습니다.",
    habits: [
      "월·수·금 35분 근력 루틴, 세트 수는 마지막 1개만 도전적으로",
      "점심 후 15분 걷기로 활동량과 혈당 반응 함께 관리하기",
      "강한 세션 다음 날은 스트레칭과 저강도 이동으로 회복일 만들기",
    ],
    metrics: [
      { label: "근력 세션", value: "3회", hint: "주간 목표 완료" },
      { label: "활동 칼로리", value: "2,640", hint: "안정적인 증가" },
      { label: "회복 상태", value: "82%", hint: "무리 없는 수준" },
    ],
    patterns: [
      { label: "근력 계획 유지", value: 88, caption: "3회 모두 수행" },
      { label: "걷기 누적", value: 72, caption: "일 평균 8.1k 보" },
      { label: "회복일 준수", value: 79, caption: "주 2회 확보" },
    ],
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
  },
  diet: {
    label: "식단 코칭",
    kicker: "포만감과 에너지 유지",
    headline: "nutrition priority",
    summary:
      "칼로리 숫자만 좇기보다 단백질, 수분, 식사 간격을 정리해 하루 에너지가 끊기지 않도록 관리합니다.",
    score: "91%",
    scoreLabel: "식단 안정도",
    target: "이번 주 목표: 단백질 110g, 수분 2.1L 유지",
    coachNote:
      "아침 단백질만 조금 더 보강하면 오후 군것질 빈도가 더 내려갈 가능성이 큽니다. 포만감의 시작점을 먼저 바꿔볼게요.",
    habits: [
      "아침 첫 식사에 단백질 25g 이상 넣어 공복 반동 줄이기",
      "오후 3시 이전 수분 1.2L 확보해서 피로감과 헛배고픔 구분하기",
      "저녁은 탄수화물 양보다 식사 속도를 먼저 늦추는 데 집중하기",
    ],
    metrics: [
      { label: "단백질 평균", value: "106g", hint: "목표 근접" },
      { label: "수분 섭취", value: "2.0L", hint: "3일 연속 유지" },
      { label: "야식 빈도", value: "1회", hint: "지난주 대비 -3회" },
    ],
    patterns: [
      { label: "아침 단백질 달성", value: 84, caption: "주 6회 기록" },
      { label: "수분 섭취 유지", value: 76, caption: "평균 2.0L" },
      { label: "야간 식사 안정", value: 91, caption: "주중 거의 유지" },
    ],
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
  },
};

const todayChecklist = [
  "22:20 디지털 셧다운으로 수면 질 확보",
  "점심 식사에 단백질 30g 이상 채우기",
  "퇴근 후 하체 근력 35분, 마지막 세트만 강도 상승",
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
          <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
                Motive Care
              </span>
              <span className="text-sm text-[var(--muted)]">
                Personal Health Coach for sleep, workout, diet
              </span>
            </div>

            <nav className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
              <a
                href="#pillars"
                className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
              >
                코칭 영역
              </a>
              <a
                href="#coach-board"
                className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
              >
                코치 보드
              </a>
              <a
                href="#report"
                className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
              >
                주간 리포트
              </a>

              {isLoggedIn ? (
                <>
                  <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 text-[var(--foreground)]">
                    {userName}님
                  </span>
                  <Link
                    href="/coach"
                    className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
                  >
                    내 코치 페이지
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--foreground)] px-4 py-2 font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      로그아웃
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-[var(--foreground)] px-4 py-2 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </header>

          <div className="grid gap-8 pt-8 xl:grid-cols-[1.24fr_0.76fr]">
            <div className="space-y-7">
              <div className="max-w-4xl space-y-5">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                  Sleep, workout, diet coaching in one flow
                </p>
                <h1 className="headline-face max-w-4xl text-4xl leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                  몸 상태를 읽고
                  <br />
                  오늘의 건강 행동을 제안하는
                  <br />
                  개인 코치 웹사이트
                </h1>
                <p className="max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                  Motive Care는 수면, 운동, 식단 데이터를 따로 흩어두지 않고 하나의 흐름으로 연결합니다. 
                  <br />
                  회복이 부족하면 운동 강도를 낮추고, 식단이 흔들리면 포만감 설계부터 다시 제안하는
                  <br /> 
                  개인 건강 코치형 웹서비스 입니다.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {isLoggedIn ? (
                  <Link
                    href="/coach"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    내 코치 페이지로 이동
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    회원가입하고 시작하기
                  </Link>
                )}
                <a
                  href="#report"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-white"
                >
                  주간 리포트 보기
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {heroSignals.map((signal) => (
                  <article
                    key={signal.label}
                    className="rounded-[1.4rem] border border-[var(--border)] bg-white/72 p-4"
                  >
                    <p className="text-sm text-[var(--muted)]">{signal.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                      {signal.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--accent-strong)]">
                      {signal.hint}
                    </p>
                  </article>
                ))}
              </div>
            </div>

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
                <div className="rounded-[1.3rem] bg-[var(--sky-soft)] px-4 py-4 text-[var(--foreground)]">
                  <p className="text-sm text-[var(--muted)]">수면</p>
                  <p className="mt-2 text-2xl font-semibold">89</p>
                </div>
                <div className="rounded-[1.3rem] bg-[var(--mint-soft)] px-4 py-4 text-[var(--foreground)]">
                  <p className="text-sm text-[var(--muted)]">운동</p>
                  <p className="mt-2 text-2xl font-semibold">4/5</p>
                </div>
                <div className="rounded-[1.3rem] bg-[var(--sun-soft)] px-4 py-4 text-[var(--foreground)]">
                  <p className="text-sm text-[var(--muted)]">식단</p>
                  <p className="mt-2 text-2xl font-semibold">91%</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="pillars" className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="panel rounded-[1.8rem] px-6 py-6 sm:px-7"
            >
              <div
                className="mb-5 inline-flex rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                  backgroundColor: pillar.softAccent,
                  color: pillar.accent,
                }}
              >
                {pillar.title}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {pillar.subtitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {pillar.summary}
              </p>

              <div className="mt-6 space-y-3">
                {pillar.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--border)] bg-white/72 px-4 py-3"
                  >
                    <span
                      className="mt-1 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: pillar.accent }}
                    />
                    <p className="text-sm leading-7 text-[var(--foreground)]">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <FocusBoard areas={focusAreas} />

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
