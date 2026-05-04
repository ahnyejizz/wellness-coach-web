"use client";

import {
  type BriefCompletionState,
  type BriefDetails,
  type BriefMetricKey,
  type BriefRecoveryState,
  useWellnessStore,
} from "@/app/stores/wellness-store";

import LockPreview from "../common/lock-preview";

import { focusAreas } from "./home-focus-board";

type HomePriorityProps = {
  isLoggedIn: boolean;
};

type PriorityMetric = {
  label: string;
  value: string;
  hint: string;
};

type PriorityPattern = {
  label: string;
  value: number;
  caption: string;
};

type PriorityContent = {
  hasData: boolean;
  target: string;
  summary: string;
  scoreLabel: string;
  score: string;
  coachNote: string;
  habits: string[];
  metrics: PriorityMetric[];
  patterns: PriorityPattern[];
};

const EMPTY_MSG = "아직 기록 전";

function getCompletionCopy(value: BriefCompletionState) {
  if (value === "done") {
    return "실천 중";
  }

  if (value === "not-yet") {
    return "아직 못 했어요";
  }

  return "미입력";
}

function getRecoveryCopy(value: BriefRecoveryState) {
  if (value === "good") {
    return "좋음";
  }

  if (value === "steady") {
    return "보통";
  }

  if (value === "low") {
    return "낮음";
  }

  return "미입력";
}

function getCompletionProgress(value: BriefCompletionState) {
  if (value === "done") {
    return 84;
  }

  if (value === "not-yet") {
    return 34;
  }

  return 18;
}

function getRecoveryProgress(value: BriefRecoveryState) {
  if (value === "good") {
    return 84;
  }

  if (value === "steady") {
    return 63;
  }

  if (value === "low") {
    return 36;
  }

  return 18;
}

function getCountProgress(value: string, multiplier: number, max = 92) {
  const numericValue = Number.parseFloat(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 18;
  }

  return Math.min(max, Math.max(24, Math.round(numericValue * multiplier)));
}

function getSleepDurationProgress(value: string) {
  const hourMatch = value.match(/(\d+(?:\.\d+)?)\s*h/i);
  const minuteMatch = value.match(/(\d+)\s*m/i);

  const hours = hourMatch ? Number.parseFloat(hourMatch[1]) : Number.parseFloat(value);
  const minutes = minuteMatch ? Number.parseFloat(minuteMatch[1]) : 0;
  const totalHours = Number.isFinite(hours) ? hours + minutes / 60 : NaN;

  if (!Number.isFinite(totalHours) || totalHours <= 0) {
    return 18;
  }

  return Math.min(92, Math.max(24, Math.round((totalHours / 8) * 92)));
}

function hasSleepDetails(details: BriefDetails["sleep"]) {
  return Boolean(
    details.sleepPrepRoutine || details.screenOffTime || details.morningSunlight || details.totalSleepDuration,
  );
}

function hasExerciseDetails(details: BriefDetails["exercise"]) {
  return Boolean(details.strengthSessions || details.activeCalories || details.recoveryStatus || details.walkSessions);
}

function hasDietDetails(details: BriefDetails["diet"]) {
  return Boolean(
    details.proteinIntake || details.waterIntake || details.snackFrequency || details.lateNightSnackFrequency,
  );
}

function getEmptyPriorityContent(focus: BriefMetricKey): PriorityContent {
  if (focus === "sleep") {
    return {
      hasData: false,
      target: "아직 수면 브리핑이 없어요.",
      summary: "오늘의 코치 브리핑에서 수면 카드를 눌러 총 수면 시간과 루틴을 입력해보세요.",
      scoreLabel: "총 수면 시간",
      score: "--",
      coachNote: "브리핑 팝업에서 입력한 수면 지표가 저장되면 이 영역에 맞춤 요약과 패턴이 표시됩니다.",
      habits: [
        "총 수면 시간을 입력하면 회복 흐름을 함께 볼 수 있어요.",
        "취침 준비 루틴 여부를 먼저 입력해보세요.",
        "스크린 오프 시간대를 입력하면 수면 흐름을 함께 볼 수 있어요.",
        "기상 후 햇빛 노출 여부와 총 수면 시간을 기록해보세요.",
      ],
      metrics: [
        { label: "스크린 오프", value: "--", hint: EMPTY_MSG },
        { label: "취침 준비 루틴", value: "--", hint: EMPTY_MSG },
        { label: "햇빛 노출", value: "--", hint: EMPTY_MSG },
      ],
      patterns: [
        { label: "총 수면 시간", value: 18, caption: EMPTY_MSG },
        { label: "스크린 오프", value: 18, caption: EMPTY_MSG },
        { label: "취침 준비 루틴", value: 18, caption: EMPTY_MSG },
        { label: "햇빛 노출", value: 18, caption: EMPTY_MSG },
      ],
    };
  }

  if (focus === "exercise") {
    return {
      hasData: false,
      target: "아직 운동 브리핑이 없어요.",
      summary: "오늘의 코치 브리핑에서 운동 카드를 눌러 주간 운동 지표를 입력해보세요.",
      scoreLabel: "주간 근력 횟수",
      score: "--",
      coachNote: "운동 팝업에서 입력한 근력, 활동 칼로리, 회복 상태가 저장되면 이 영역에 요약이 표시됩니다.",
      habits: [
        "주간 근력 횟수를 입력해 현재 루틴 강도를 기록해보세요.",
        "활동 칼로리와 걷기 횟수를 함께 넣으면 움직임 흐름을 볼 수 있어요.",
        "회복 상태를 입력하면 이번 주 운동 톤을 더 자연스럽게 정리할 수 있어요.",
      ],
      metrics: [
        { label: "근력 세션", value: "--", hint: EMPTY_MSG },
        { label: "활동 칼로리", value: "--", hint: EMPTY_MSG },
        { label: "회복 상태", value: "--", hint: EMPTY_MSG },
      ],
      patterns: [
        { label: "근력 계획 유지", value: 18, caption: EMPTY_MSG },
        { label: "걷기 루틴 유지", value: 18, caption: EMPTY_MSG },
        { label: "회복 흐름", value: 18, caption: EMPTY_MSG },
      ],
    };
  }

  return {
    hasData: false,
    target: "아직 식단 브리핑이 없어요.",
    summary: "오늘의 코치 브리핑에서 식단 카드를 눌러 단백질, 수분, 야식 빈도를 입력해보세요.",
    scoreLabel: "단백질 섭취량",
    score: "--",
    coachNote: "식단 팝업에서 입력한 지표가 저장되면 이 영역에 식사 안정도 요약과 이번 주 패턴이 표시됩니다.",
    habits: [
      "하루 단백질 섭취량을 먼저 입력해 식사 기준선을 잡아보세요.",
      "수분 섭취량을 입력하면 에너지 흐름과 함께 볼 수 있어요.",
      "군것질 횟수를 기록하면 낮 시간 식사 패턴을 더 자연스럽게 해석할 수 있어요.",
      "야식 빈도를 기록하면 밤 식사 패턴을 더 자연스럽게 해석할 수 있어요.",
    ],
    metrics: [
      { label: "단백질 평균", value: "--", hint: EMPTY_MSG },
      { label: "수분 섭취", value: "--", hint: EMPTY_MSG },
      { label: "야식 빈도", value: "--", hint: EMPTY_MSG },
    ],
    patterns: [
      { label: "단백질 섭취 유지", value: 18, caption: EMPTY_MSG },
      { label: "수분 섭취 유지", value: 18, caption: EMPTY_MSG },
      { label: "야간 식사 안정", value: 18, caption: EMPTY_MSG },
    ],
  };
}

function getPriorityContent(focus: BriefMetricKey, details: BriefDetails): PriorityContent {
  if (focus === "sleep") {
    const sleepDetails = details.sleep;

    if (!hasSleepDetails(sleepDetails)) {
      return getEmptyPriorityContent("sleep");
    }

    const targetParts = [
      sleepDetails.totalSleepDuration ? `총 수면 ${sleepDetails.totalSleepDuration}` : "",
      sleepDetails.screenOffTime ? `${sleepDetails.screenOffTime} 스크린 오프` : "",
    ].filter(Boolean);

    return {
      hasData: true,
      target: targetParts.join(", ") || "수면 루틴 기록이 저장되었어요.",
      summary: "입력한 취침 루틴과 회복 흐름을 기준으로 이번 수면 패턴을 정리합니다.",
      scoreLabel: "총 수면 시간",
      score: sleepDetails.totalSleepDuration || "--",
      coachNote: [
        sleepDetails.totalSleepDuration
          ? `총 수면 시간은 ${sleepDetails.totalSleepDuration}으로 기록됐어요.`
          : "총 수면 시간을 입력하면 회복 흐름을 더 정확하게 볼 수 있어요.",
        sleepDetails.screenOffTime
          ? `${sleepDetails.screenOffTime} 전후로 스크린 오프 시간대를 유지해보세요.`
          : "스크린 오프 시간대를 정하면 수면 리듬이 더 안정됩니다.",
        `취침 준비 루틴은 ${getCompletionCopy(sleepDetails.sleepPrepRoutine)} 상태예요.`,
        sleepDetails.morningSunlight === "done"
          ? "기상 후 햇빛 노출도 함께 챙기고 있어요."
          : sleepDetails.morningSunlight === "not-yet"
            ? "기상 직후 10분 햇빛 노출을 더해보세요."
            : "햇빛 노출 여부를 입력하면 각성 리듬 해석이 쉬워집니다.",
      ].join(" "),
      habits: [
        sleepDetails.totalSleepDuration
          ? `총 수면 시간: ${sleepDetails.totalSleepDuration}`
          : "총 수면 시간을 아직 입력하지 않았어요.",
        sleepDetails.screenOffTime
          ? `스크린 오프 시간대: ${sleepDetails.screenOffTime}`
          : "스크린 오프 시간대를 아직 설정하지 않았어요.",
        `취침 준비 루틴: ${getCompletionCopy(sleepDetails.sleepPrepRoutine)}`,
        `기상 후 햇빛 노출: ${getCompletionCopy(sleepDetails.morningSunlight)}`,
      ],
      metrics: [
        {
          label: "스크린 오프",
          value: sleepDetails.screenOffTime || "--",
          hint: sleepDetails.screenOffTime ? "기록 완료" : EMPTY_MSG,
        },
        {
          label: "취침 준비 루틴",
          value: getCompletionCopy(sleepDetails.sleepPrepRoutine),
          hint: sleepDetails.sleepPrepRoutine ? "기록 완료" : EMPTY_MSG,
        },
        {
          label: "햇빛 노출",
          value: getCompletionCopy(sleepDetails.morningSunlight),
          hint: sleepDetails.morningSunlight ? "기록 완료" : EMPTY_MSG,
        },
      ],
      patterns: [
        {
          label: "총 수면 시간",
          value: getSleepDurationProgress(sleepDetails.totalSleepDuration),
          caption: sleepDetails.totalSleepDuration ? `${sleepDetails.totalSleepDuration} 기록` : EMPTY_MSG,
        },
        {
          label: "스크린 오프 시간대",
          value: sleepDetails.screenOffTime ? 74 : 18,
          caption: sleepDetails.screenOffTime ? `${sleepDetails.screenOffTime} 설정` : "시간대 미설정",
        },
        {
          label: "취침 준비 루틴",
          value: getCompletionProgress(sleepDetails.sleepPrepRoutine),
          caption: getCompletionCopy(sleepDetails.sleepPrepRoutine),
        },
        {
          label: "기상 후 햇빛 노출",
          value: getCompletionProgress(sleepDetails.morningSunlight),
          caption: getCompletionCopy(sleepDetails.morningSunlight),
        },
      ],
    };
  }

  if (focus === "exercise") {
    const exerciseDetails = details.exercise;

    if (!hasExerciseDetails(exerciseDetails)) {
      return getEmptyPriorityContent("exercise");
    }

    const targetParts = [
      exerciseDetails.strengthSessions ? `근력 ${exerciseDetails.strengthSessions}회` : "",
      exerciseDetails.walkSessions ? `걷기 ${exerciseDetails.walkSessions}회` : "",
    ].filter(Boolean);

    return {
      hasData: true,
      target: targetParts.join(" + ") || "운동 루틴 기록이 저장되었어요.",
      summary: "입력한 운동 횟수와 회복 상태를 기준으로 이번 주 운동 흐름을 정리합니다.",
      scoreLabel: "주간 근력 횟수",
      score: exerciseDetails.strengthSessions ? `${exerciseDetails.strengthSessions}회` : "--",
      coachNote: [
        exerciseDetails.strengthSessions
          ? `이번 주 근력 세션은 ${exerciseDetails.strengthSessions}회로 기록됐어요.`
          : "근력 세션 기록이 아직 비어 있어요.",
        exerciseDetails.activeCalories
          ? `활동 칼로리 ${exerciseDetails.activeCalories}kcal 흐름도 함께 보고 있어요.`
          : "활동 칼로리도 함께 입력하면 움직임 해석이 더 쉬워집니다.",
        `회복 상태는 ${getRecoveryCopy(exerciseDetails.recoveryStatus)} 수준으로 보고 있어요.`,
      ].join(" "),
      habits: [
        exerciseDetails.strengthSessions
          ? `주간 근력 횟수: ${exerciseDetails.strengthSessions}회`
          : "주간 근력 횟수를 아직 입력하지 않았어요.",
        exerciseDetails.activeCalories
          ? `활동 칼로리: ${exerciseDetails.activeCalories} kcal`
          : "활동 칼로리 기록이 아직 없어요.",
        exerciseDetails.walkSessions
          ? `걷기 횟수: ${exerciseDetails.walkSessions}회`
          : "걷기 횟수를 아직 입력하지 않았어요.",
      ],
      metrics: [
        {
          label: "근력 세션",
          value: exerciseDetails.strengthSessions ? `${exerciseDetails.strengthSessions}회` : "--",
          hint: exerciseDetails.strengthSessions ? "이번 기록 기준" : EMPTY_MSG,
        },
        {
          label: "활동 칼로리",
          value: exerciseDetails.activeCalories ? `${exerciseDetails.activeCalories}` : "--",
          hint: exerciseDetails.activeCalories ? "이번 기록 기준" : EMPTY_MSG,
        },
        {
          label: "회복 상태",
          value: getRecoveryCopy(exerciseDetails.recoveryStatus),
          hint: exerciseDetails.recoveryStatus ? "체감 회복 기준" : EMPTY_MSG,
        },
      ],
      patterns: [
        {
          label: "근력 계획 유지",
          value: getCountProgress(exerciseDetails.strengthSessions, 24),
          caption: exerciseDetails.strengthSessions ? `${exerciseDetails.strengthSessions}회 기록` : EMPTY_MSG,
        },
        {
          label: "걷기 루틴 유지",
          value: getCountProgress(exerciseDetails.walkSessions, 18),
          caption: exerciseDetails.walkSessions ? `${exerciseDetails.walkSessions}회 기록` : EMPTY_MSG,
        },
        {
          label: "회복 흐름",
          value: getRecoveryProgress(exerciseDetails.recoveryStatus),
          caption: getRecoveryCopy(exerciseDetails.recoveryStatus),
        },
      ],
    };
  }

  const dietDetails = details.diet;

  if (!hasDietDetails(dietDetails)) {
    return getEmptyPriorityContent("diet");
  }

  const targetParts = [
    dietDetails.proteinIntake ? `단백질 ${dietDetails.proteinIntake}g` : "",
    dietDetails.waterIntake ? `수분 ${dietDetails.waterIntake}L` : "",
  ].filter(Boolean);

  return {
    hasData: true,
    target: targetParts.join(", ") || "식단 기록이 저장되었어요.",
    summary: "입력한 단백질, 수분, 야식 빈도를 기준으로 이번 주 식사 흐름을 정리합니다.",
    scoreLabel: "단백질 섭취량",
    score: dietDetails.proteinIntake ? `${dietDetails.proteinIntake}g` : "--",
    coachNote: [
      dietDetails.proteinIntake
        ? `하루 단백질 섭취량은 ${dietDetails.proteinIntake}g로 기록됐어요.`
        : "단백질 섭취량 기록이 아직 없어요.",
      dietDetails.waterIntake
        ? `수분은 ${dietDetails.waterIntake}L 기준으로 보고 있어요.`
        : "수분 섭취량도 함께 입력하면 식사 흐름을 더 잘 볼 수 있어요.",
      dietDetails.snackFrequency
        ? `군것질 횟수는 ${dietDetails.snackFrequency}회로 기록됐어요.`
        : "군것질 횟수를 함께 기록하면 낮 시간 식사 흐름을 더 잘 볼 수 있어요.",
      dietDetails.lateNightSnackFrequency
        ? `야식 빈도는 ${dietDetails.lateNightSnackFrequency}회로 기록됐어요.`
        : "야식 빈도를 함께 기록하면 밤 식사 패턴을 더 자연스럽게 해석할 수 있어요.",
    ].join(" "),
    habits: [
      dietDetails.proteinIntake
        ? `하루 단백질 섭취량: ${dietDetails.proteinIntake}g`
        : "하루 단백질 섭취량을 아직 입력하지 않았어요.",
      dietDetails.waterIntake ? `수분 섭취량: ${dietDetails.waterIntake}L` : "수분 섭취량을 아직 입력하지 않았어요.",
      dietDetails.snackFrequency
        ? `군것질 횟수: ${dietDetails.snackFrequency}회`
        : "군것질 횟수를 아직 입력하지 않았어요.",
      dietDetails.lateNightSnackFrequency
        ? `야식 빈도: ${dietDetails.lateNightSnackFrequency}회`
        : "야식 빈도를 아직 입력하지 않았어요.",
    ],
    metrics: [
      {
        label: "단백질 평균",
        value: dietDetails.proteinIntake ? `${dietDetails.proteinIntake}g` : "--",
        hint: dietDetails.proteinIntake ? "이번 기록 기준" : EMPTY_MSG,
      },
      {
        label: "수분 섭취",
        value: dietDetails.waterIntake ? `${dietDetails.waterIntake}L` : "--",
        hint: dietDetails.waterIntake ? "이번 기록 기준" : EMPTY_MSG,
      },
      {
        label: "야식 빈도",
        value: dietDetails.lateNightSnackFrequency ? `${dietDetails.lateNightSnackFrequency}회` : "--",
        hint: dietDetails.lateNightSnackFrequency ? "이번 기록 기준" : EMPTY_MSG,
      },
    ],
    patterns: [
      {
        label: "단백질 섭취 유지",
        value: getCountProgress(dietDetails.proteinIntake, 0.8),
        caption: dietDetails.proteinIntake ? `${dietDetails.proteinIntake}g 기록` : EMPTY_MSG,
      },
      {
        label: "수분 섭취 유지",
        value: getCountProgress(dietDetails.waterIntake, 34),
        caption: dietDetails.waterIntake ? `${dietDetails.waterIntake}L 기록` : EMPTY_MSG,
      },
      {
        label: "야간 식사 안정",
        value: dietDetails.lateNightSnackFrequency
          ? Math.max(28, 92 - Number.parseFloat(dietDetails.lateNightSnackFrequency) * 18)
          : 18,
        caption:
          dietDetails.snackFrequency || dietDetails.lateNightSnackFrequency
            ? `군것질 ${dietDetails.snackFrequency || "0"}회 · 야식 ${dietDetails.lateNightSnackFrequency || "0"}회`
            : EMPTY_MSG,
      },
    ],
  };
}

export default function HomePriority({ isLoggedIn }: HomePriorityProps) {
  const activeFocus = useWellnessStore((state) => state.activeFocus);
  const briefDetails = useWellnessStore((state) => state.briefDetails);
  const current = focusAreas[activeFocus];
  const currentPriority = getPriorityContent(activeFocus, briefDetails);

  return (
    <article className="panel panel-strong ui-panel-shell">
      {isLoggedIn ? (
        <>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="ui-kicker">{current.headline}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                <h3 className="ui-title-3 shrink-0">이번주 목표:</h3>
                <p className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {currentPriority.hasData ? currentPriority.target : "--"}
                </p>
              </div>
              <p className="ui-copy mt-4">{currentPriority.summary}</p>
            </div>

            <div
              className="rounded-[1.5rem] border border-[var(--border)] px-6 py-4 sm:min-w-[7rem]"
              style={{ backgroundColor: current.softAccent }}
            >
              <p className="text-base font-medium text-[var(--muted)]">{currentPriority.scoreLabel}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                {currentPriority.score}
              </p>
            </div>
          </div>

          <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[1.0fr_1.12fr]">
            <div className="ui-card-raised h-full">
              <p className="text-sm font-medium text-[var(--muted)]">Coach note</p>
              <p className="mt-3 text-base leading-7 text-[var(--foreground)]">{currentPriority.coachNote}</p>

              <div className="mt-6 space-y-3">
                {currentPriority.habits.map((habit) => (
                  <div key={habit} className="ui-card-note flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: current.accent }} />
                    <p className="text-sm leading-7 text-[var(--foreground)]">{habit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {currentPriority.metrics.map((metric) => (
                  <article key={metric.label} className="ui-card-compact">
                    <p className="text-sm text-[var(--muted)]">{metric.label}</p>
                    <p className="mt-3 text-[2rem] font-semibold tracking-tight text-[var(--foreground)]">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: current.accent }}>
                      {metric.hint}
                    </p>
                  </article>
                ))}
              </div>

              <div className="ui-card-raised flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--muted)]">이번주 패턴</p>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: current.softAccent, color: current.accent }}
                  >
                    {currentPriority.hasData ? "live coach" : "empty state"}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {currentPriority.patterns.map((pattern) => (
                    <div key={pattern.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--foreground)]">{pattern.label}</span>
                        <span className="text-[var(--muted)]">{pattern.caption}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[rgba(22,48,43,0.08)]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${pattern.value}%`,
                            backgroundColor: current.accent,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl flex-1">
              <p className="ui-kicker">{current.headline}</p>
              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
                <h3 className="ui-title-3 shrink-0">이번주 목표:</h3>
                <LockPreview
                  className="flex-1"
                  accent={current.accent}
                  softAccent={current.softAccent}
                  lineWidths={["79%", "66%"]}
                  lineAlign="center"
                  boxClassName="px-4 py-3"
                  previewAreaClassName="flex min-h-[5rem] items-center justify-center"
                  lineClassName="h-2.5 rounded-full"
                  messageInside
                  messageClassName="mt-1 text-sm text-[var(--muted)]"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/76 px-6 py-4 sm:min-w-[7rem]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-[var(--muted)]">{current.scoreLabel}</p>
              </div>
              <LockPreview
                className="mt-4"
                accent={current.accent}
                softAccent={current.softAccent}
                lineWidths={["4rem"]}
                boxClassName="flex h-[4rem] items-center justify-center bg-white/70"
                messageClassName="mt-3 text-xs leading-5 text-[var(--muted)]"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="ui-card-raised">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--muted)]">Coach note</p>
              </div>
              <LockPreview
                className="mt-4"
                accent={current.accent}
                softAccent={current.softAccent}
                lineWidths={["92%", "85%", "68%"]}
                boxClassName="p-4 rounded-[1.3rem]"
                messageClassName="mt-3 text-sm text-[var(--muted)]"
              />

              <div className="mt-6 space-y-3">
                {current.habits.map((habit) => (
                  <div key={habit} className="ui-card-note flex items-start gap-3 opacity-70">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: current.accent }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 rounded-full" style={{ width: "82%", backgroundColor: current.softAccent }} />
                      <div className="h-3 rounded-full" style={{ width: "58%", backgroundColor: current.softAccent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {current.metrics.map((metric) => (
                  <article key={metric.label} className="ui-card-compact">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-[var(--muted)]">{metric.label}</p>
                    </div>
                    <LockPreview
                      className="mt-4"
                      accent={current.accent}
                      softAccent={current.softAccent}
                      lineWidths={["5rem"]}
                      boxClassName="flex h-20 items-center justify-center"
                      messageClassName="mt-3 text-xs leading-5 text-[var(--muted)]"
                    />
                  </article>
                ))}
              </div>

              <div className="ui-card-raised min-h-[18rem]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--muted)]">이번주 패턴</p>
                </div>

                <div className="mt-5 space-y-4">
                  {current.patterns.map((pattern) => (
                    <div key={pattern.label} className="opacity-72">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--foreground)]">{pattern.label}</span>
                        <span className="text-[var(--muted)]">로그인 후 확인</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[rgba(22,48,43,0.08)]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(28, Math.round(pattern.value * 0.55))}%`,
                            backgroundColor: current.softAccent,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
