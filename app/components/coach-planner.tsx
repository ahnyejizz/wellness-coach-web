"use client";

import {
  clampProteinTarget,
  clampWaterTarget,
  clampWorkoutDays,
  getSavedPlanLabel,
  type FocusKey,
  type GoalKey,
  type MealPatternKey,
  type PlannerProfile,
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

function buildPlan(profile: PlannerProfile): PersonalPlan {
  const goal = goalMeta[profile.goal];
  const focus = focusMeta[profile.focus];
  const displayName = profile.name.trim() || "당신";
  const weeklyLoad =
    profile.workoutDays >= 5 ? "강-중-중-가벼움 분배" : profile.workoutDays >= 4 ? "중-중-가벼움 분배" : "짧고 꾸준한 분배";

  return {
    heading: `${displayName}님을 위한 ${goal.label} 코칭 플랜`,
    summary: `${goal.summary} 지금 주간 우선순위는 ${focus.label}이고, 식사는 ${
      mealPatternMeta[profile.mealPattern]
    } 방향으로 맞춥니다.`,
    coachMessage: `${focus.summary}. 이번 주는 ${
      profile.goal === "sleep-reset"
        ? "취침 시간을 먼저 고정한 뒤 운동 볼륨을 조절하는 편이 좋습니다."
        : profile.goal === "fat-loss"
          ? "식단 제한보다 식사 간격과 활동량을 정돈하는 쪽이 오래 갑니다."
          : profile.goal === "muscle-tone"
            ? "운동 세션 수보다 회복과 단백질 타이밍을 더 엄격하게 챙겨야 합니다."
            : "수면, 식사, 움직임 중 하나가 흔들리면 전체 에너지가 무너지니 앵커 행동을 먼저 지켜볼게요."
    }`,
    score: `${78 + profile.workoutDays * 3}`,
    scoreLabel: "이번 주 코칭 적합도",
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
        title: `${focus.label} 앵커 시작`,
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

export default function CoachPlanner() {
  const profile = useWellnessStore((state) => state.profile);
  const hasHydrated = useWellnessStore((state) => state.hasHydrated);
  const lastSavedAt = useWellnessStore((state) => state.lastSavedAt);
  const updateProfile = useWellnessStore((state) => state.updateProfile);
  const saveProfile = useWellnessStore((state) => state.saveProfile);
  const resetProfile = useWellnessStore((state) => state.resetProfile);
  const plan: PersonalPlan = buildPlan(profile);
  const savedLabel = getSavedPlanLabel(lastSavedAt, hasHydrated);

  return (
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <article className="panel rounded-[2rem] px-6 py-7 sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          Plan studio
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          내 루틴에 맞는 건강 코칭 플랜 만들기
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          목표와 루틴을 입력하면, 수면·운동·식단 우선순위에 맞춘 개인 코칭
          플랜을 바로 만들어줍니다.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">이름</span>
            <input
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.name}
              onChange={(event) => updateProfile("name", event.target.value)}
              placeholder="이름을 입력하세요"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">핵심 목표</span>
            <select
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.goal}
              onChange={(event) => updateProfile("goal", event.target.value as GoalKey)}
            >
              <option value="steady-energy">하루 에너지 안정화</option>
              <option value="sleep-reset">수면 리셋</option>
              <option value="fat-loss">체지방 감량</option>
              <option value="muscle-tone">탄탄한 몸 만들기</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">우선 코칭 축</span>
            <select
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.focus}
              onChange={(event) => updateProfile("focus", event.target.value as FocusKey)}
            >
              <option value="sleep">수면</option>
              <option value="exercise">운동</option>
              <option value="diet">식단</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">기본 식사 스타일</span>
            <select
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.mealPattern}
              onChange={(event) =>
                updateProfile("mealPattern", event.target.value as MealPatternKey)
              }
            >
              <option value="balanced">균형 식사</option>
              <option value="protein-forward">단백질 우선 식사</option>
              <option value="gentle-balance">부담 없는 식사</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">목표 취침 시간</span>
            <input
              type="time"
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.bedtime}
              onChange={(event) => updateProfile("bedtime", event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">주간 운동 횟수</span>
            <input
              type="number"
              min={2}
              max={6}
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.workoutDays}
              onChange={(event) =>
                updateProfile(
                  "workoutDays",
                  clampWorkoutDays(Number.parseInt(event.target.value, 10) || 2),
                )
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">하루 단백질 목표</span>
            <input
              type="number"
              min={60}
              max={180}
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.proteinTarget}
              onChange={(event) =>
                updateProfile(
                  "proteinTarget",
                  clampProteinTarget(Number.parseInt(event.target.value, 10) || 60),
                )
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">하루 수분 목표 (L)</span>
            <input
              type="number"
              min={1}
              max={4}
              step={0.1}
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition-colors duration-200 focus:border-[var(--foreground)]"
              value={profile.waterTarget}
              onChange={(event) =>
                updateProfile(
                  "waterTarget",
                  clampWaterTarget(Number.parseFloat(event.target.value) || 1),
                )
              }
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">{savedLabel}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              입력값은 자동으로 유지되고, 저장 버튼은 현재 플랜에 기준 시각을
              남깁니다.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={resetProfile}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-white"
            >
              기본 플랜으로 초기화
            </button>
            <button
              type="button"
              onClick={saveProfile}
              className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
            >
              현재 플랜 저장
            </button>
          </div>
        </div>
      </article>

      <article className="panel-dark rounded-[2rem] px-6 py-7 text-[#f6f0e6] sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/70">
              Personalized preview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {plan.heading}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/80">{plan.summary}</p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">
            <p className="text-sm text-white/70">{plan.scoreLabel}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">{plan.score}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {plan.cards.map((card) => (
            <article
              key={card.label}
              className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4"
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

        <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/6 p-5">
          <p className="text-sm text-white/70">Coach message</p>
          <p className="mt-3 text-lg leading-8">{plan.coachMessage}</p>
        </div>

        <div className="mt-6 space-y-4">
          {plan.actions.map((action) => (
            <article
              key={action.slot}
              className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5"
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
      </article>
    </section>
  );
}
