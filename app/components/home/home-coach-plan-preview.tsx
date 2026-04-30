"use client";

import LockPreview from "../common/lock-preview";

import {
  type FocusKey,
  type GoalKey,
  type MealPatternKey,
  type PlanProfile,
  useWellnessStore,
} from "@/app/stores/wellness-store";

type PlanCard = {
  label: string;
  value: string;
  detail: string;
  accent: string;
  softAccent: string;
};

type PlanAction = {
  slot: string;
  title: string;
  detail: string;
  accent: string;
  softAccent: string;
};

type PersonalPlan = {
  heading: string;
  summary: string;
  coachMessage: string;
  score: string;
  scoreLabel: string;
  cards: PlanCard[];
  actions: PlanAction[];
};

const goalMeta = {
  "sleep-reset": {
    label: "수면 리셋",
    summary: "회복 중심 루틴으로 잠드는 시간과 기상 리듬을 안정시키는 목표예요.",
  },
  "fat-loss": {
    label: "체지방 감량",
    summary: "과한 제한보다 포만감과 활동량을 함께 관리해 감량 흐름을 유지하는 목표예요.",
  },
  "muscle-tone": {
    label: "탄탄한 몸 만들기",
    summary: "근력 훈련과 단백질 섭취를 함께 맞춰 몸의 선명도를 높이는 목표예요.",
  },
  "steady-energy": {
    label: "하루 에너지 안정화",
    summary: "수면, 식사, 움직임을 고르게 맞춰 피로감이 덜한 하루를 만드는 목표예요.",
  },
} satisfies Record<GoalKey, { label: string; summary: string }>;

const focusMeta = {
  sleep: {
    label: "수면",
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
    summary: "잠드는 시간과 회복 질을 가장 먼저 챙기는 주간 플랜",
    morning: "기상 후 10분 햇빛과 물 한 컵으로 생체 리듬 깨우기",
    midday: "오후 카페인 컷오프 시간을 14:00 이전으로 고정하기",
    evening: "취침 40분 전 스크린 종료와 조명 낮추기로 진입 신호 만들기",
  },
  exercise: {
    label: "운동",
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
    summary: "무리 없는 강도로 운동 습관을 이어가는 주간 플랜",
    morning: "아침 6분 모빌리티로 관절과 코어 먼저 깨우기",
    midday: "점심 후 15분 걷기로 활동량과 회복을 함께 유지하기",
    evening: "계획된 세션은 강도보다 완수율을 우선으로 수행하기",
  },
  diet: {
    label: "식단",
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
    summary: "포만감과 단백질 중심으로 식단 패턴을 안정화하는 주간 플랜",
    morning: "아침 첫 식사에 단백질 25g 이상 배치하기",
    midday: "점심은 탄수화물보다 단백질과 채소를 먼저 먹기",
    evening: "야식 대신 따뜻한 음료와 느린 식사 속도로 마무리하기",
  },
} satisfies Record<
  FocusKey,
  {
    label: string;
    accent: string;
    softAccent: string;
    summary: string;
    morning: string;
    midday: string;
    evening: string;
  }
>;

const mealPatternMeta = {
  balanced: "한 끼의 완성도를 고르게 유지하는 균형 식사",
  "protein-forward": "단백질 우선 배치로 포만감과 회복을 챙기는 식사",
  "gentle-balance": "부담 없는 소화와 안정적인 혈당 흐름에 맞춘 식사",
} satisfies Record<MealPatternKey, string>;

function buildPlan(profile: PlanProfile): PersonalPlan {
  const goal = goalMeta[profile.goal];
  const focus = focusMeta[profile.focus];
  const displayName = profile.name.trim();

  const headingSubject = displayName ? `${displayName}님` : "당신";

  const weeklyLoad =
    profile.workoutDays >= 5
      ? "강-중-중-가벼움 분배"
      : profile.workoutDays >= 4
        ? "중-중-가벼움 분배"
        : "짧고 꾸준한 분배";

  return {
    heading: `${headingSubject}을 위한 ${goal.label} 코칭 플랜`,
    summary: `${goal.summary}
    지금 주간 우선순위는 ${focus.label}이고, 
    식사는 ${mealPatternMeta[profile.mealPattern]} 방향으로 맞춥니다.`,
    coachMessage: `${focus.summary}.
    이번 주는 ${
      profile.goal === "sleep-reset"
        ? "취침 시간을 먼저 고정한 뒤 운동 볼륨을 조절하는 편이 좋습니다."
        : profile.goal === "fat-loss"
          ? "식단 제한보다 식사 간격과 활동량을 정돈하는 쪽이 오래 갑니다."
          : profile.goal === "muscle-tone"
            ? "운동 세션 수보다 회복과 단백질 타이밍을 더 엄격하게 챙겨야 합니다."
            : "수면, 식사, 움직임 중 하나가 흔들리면 전체 에너지가 무너지니 루틴을 먼저 지켜볼게요."
    }`,
    score: `${78 + profile.workoutDays * 3}`,
    scoreLabel: "이번주 코칭 적합도",
    cards: [
      {
        label: "취침 목표",
        value: profile.bedtime,
        detail: "주 5일 이상 유지",
        accent: "var(--sky)",
        softAccent: "var(--sky-soft)",
      },
      {
        label: "운동 빈도",
        value: `주 ${profile.workoutDays}회`,
        detail: weeklyLoad,
        accent: "var(--mint)",
        softAccent: "var(--mint-soft)",
      },
      {
        label: "단백질 목표",
        value: `${profile.proteinTarget}g`,
        detail: "아침 단백질 우선",
        accent: "var(--sun)",
        softAccent: "var(--sun-soft)",
      },
      {
        label: "수분 목표",
        value: `${profile.waterTarget.toFixed(1)}L`,
        detail: "오후 3시 전 절반 이상",
        accent: "var(--accent-strong)",
        softAccent: "var(--accent-soft)",
      },
    ],
    actions: [
      {
        slot: "Morning",
        title: `${focus.label} 루틴 시작`,
        detail: focus.morning,
        accent: focus.accent,
        softAccent: focus.softAccent,
      },
      {
        slot: "Midday",
        title: "오후 흐름 안정화",
        detail: focus.midday,
        accent: focus.accent,
        softAccent: focus.softAccent,
      },
      {
        slot: "Evening",
        title: "밤 루틴 정리",
        detail: focus.evening,
        accent: focus.accent,
        softAccent: focus.softAccent,
      },
    ],
  };
}

type HomeCoachPlanPreviewProps = {
  isLoggedIn: boolean;
};

export default function HomeCoachPlanPreview({ isLoggedIn }: HomeCoachPlanPreviewProps) {
  const profile = useWellnessStore((state) => state.profile);
  const plan = buildPlan(profile);
  const guestPlanSummary = `수면, 식사, 움직임 흐름을 함께 보면서 일상에 맞는 코칭 방향을 정리합니다.
  로그인하면 입력한 루틴과 목표를 바탕으로 개인 맞춤형 플랜이 이어집니다.`;

  return (
    <article className="panel-dark rounded-[2rem] px-6 py-7 text-[#f6f0e6] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_54px_rgba(14,26,24,0.28)] sm:px-8">
      {isLoggedIn ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-white/70">Personalized preview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{plan.heading}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/80">{plan.summary}</p>
            </div>

            <div className="rounded-[1.5rem] bg-white/10 px-5 py-4 lg:min-w-[10rem]">
              <p className="text-sm text-white/70">{plan.scoreLabel}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{plan.score}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {plan.cards.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_16px_28px_rgba(14,26,24,0.18)]"
              >
                <p className="text-sm text-white/70">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</p>
                <span
                  className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: card.softAccent,
                    color: card.accent,
                  }}
                >
                  {card.detail}
                </span>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/6 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_18px_30px_rgba(14,26,24,0.18)]">
            <p className="text-sm text-white/70">Coach message</p>
            <p className="mt-3 whitespace-pre-line text-lg leading-8">{plan.coachMessage}</p>
          </div>

          <div className="mt-6 space-y-4">
            {plan.actions.map((action) => (
              <article
                key={action.slot}
                className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_18px_30px_rgba(14,26,24,0.18)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: action.softAccent,
                      color: action.accent,
                    }}
                  >
                    {action.slot}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{action.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/80">{action.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl flex-1">
              <p className="text-sm uppercase tracking-[0.24em] text-white/70">Personalized preview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{plan.heading}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/80">{guestPlanSummary}</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-4 sm:min-w-[12rem]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white/70">이번주 코칭 적합도</p>
              </div>
              <LockPreview
                className="mt-4"
                accent="var(--accent-strong)"
                softAccent="rgba(255,255,255,0.08)"
                theme="dark"
                lineWidths={["3.5rem"]}
                lineColor="rgba(255,255,255,0.2)"
                boxClassName="flex h-[5.5rem] items-center justify-center"
                messageClassName="mt-3 text-xs leading-5 text-white/72"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["취침 목표", "운동 빈도", "단백질 목표", "수분 목표"].map((label) => (
              <article key={label} className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-white/70">{label}</p>
                </div>
                <LockPreview
                  className="mt-4"
                  accent="var(--accent-strong)"
                  softAccent="rgba(255,255,255,0.08)"
                  theme="dark"
                  lineWidths={["6rem"]}
                  lineColor="rgba(255,255,255,0.2)"
                  boxClassName="flex h-20 items-center justify-center"
                  messageClassName="mt-3 text-xs leading-5 text-white/72"
                />
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/6 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_18px_30px_rgba(14,26,24,0.18)]">
            <p className="text-sm text-white/70">Coach message</p>
            <p className="mt-3 whitespace-pre-line text-lg leading-8">{plan.coachMessage}</p>
          </div>

          <div className="mt-6 space-y-4">
            {plan.actions.map((action) => (
              <article
                key={action.slot}
                className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_18px_30px_rgba(14,26,24,0.18)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: action.softAccent,
                      color: action.accent,
                    }}
                  >
                    {action.slot}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{action.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/80">{action.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
