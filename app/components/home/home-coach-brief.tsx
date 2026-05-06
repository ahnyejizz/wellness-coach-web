"use client";

import Link from "next/link";
import { useState } from "react";

import DailySurveyDialog from "@/app/components/plan/daily-survey-dialog";
import SaveAlert from "@/app/components/common/alert/save-alert";
import { type BriefDetails, type BriefMetricKey, useWellnessStore } from "@/app/stores/wellness-store";

const todayChecklist = [
  "22:20 디지털 셧다운으로 수면 질 확보",
  "점심 식사에 단백질 30g 이상 채우기",
  "퇴근 후 하체 근력 35분, 마지막 세트만 강도 상승",
];

const briefScoreCards = [
  {
    key: "sleep",
    label: "수면",
    tint: "#e5f2fb",
    emptyHint: "클릭해서 더 보기",
  },
  {
    key: "exercise",
    label: "운동",
    tint: "#dbecea",
    emptyHint: "클릭해서 더 보기",
  },
  {
    key: "diet",
    label: "식단",
    tint: "#f8eede",
    emptyHint: "클릭해서 더 보기",
  },
] as const satisfies ReadonlyArray<{
  key: BriefMetricKey;
  label: string;
  tint: string;
  emptyHint: string;
}>;

type HomeCoachBriefProps = {
  isLoggedIn: boolean;
};

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

function hasBriefDetails(key: BriefMetricKey, details: BriefDetails) {
  if (key === "sleep") {
    return hasSleepDetails(details.sleep);
  }

  if (key === "exercise") {
    return hasExerciseDetails(details.exercise);
  }

  return hasDietDetails(details.diet);
}

function getCompletionCopy(value: BriefDetails["sleep"]["sleepPrepRoutine"]) {
  if (value === "done") {
    return "실천 중";
  }

  if (value === "not-yet") {
    return "아직 못 했어요";
  }

  return "미입력";
}

function getRecoveryCopy(value: BriefDetails["exercise"]["recoveryStatus"]) {
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

function getCardContent(key: BriefMetricKey, details: BriefDetails) {
  if (key === "sleep") {
    if (!hasSleepDetails(details.sleep)) {
      return null;
    }

    return {
      primary: details.sleep.totalSleepDuration || "수면 기록 입력됨",
      secondary: details.sleep.screenOffTime
        ? `스크린 오프 ${details.sleep.screenOffTime}`
        : `취침 루틴 ${getCompletionCopy(details.sleep.sleepPrepRoutine)}`,
    };
  }

  if (key === "exercise") {
    if (!hasExerciseDetails(details.exercise)) {
      return null;
    }

    return {
      primary: details.exercise.strengthSessions ? `근력 ${details.exercise.strengthSessions}회` : "운동 기록 입력됨",
      secondary: details.exercise.activeCalories
        ? `활동 ${details.exercise.activeCalories} kcal`
        : `회복 ${getRecoveryCopy(details.exercise.recoveryStatus)}`,
    };
  }

  if (!hasDietDetails(details.diet)) {
    return null;
  }

  return {
    primary: details.diet.proteinIntake ? `단백질 ${details.diet.proteinIntake}g` : "식단 기록 입력됨",
    secondary: details.diet.waterIntake
      ? `수분 ${details.diet.waterIntake}L${details.diet.snackFrequency ? ` · 군것질 ${details.diet.snackFrequency}회` : ""}`
      : details.diet.snackFrequency
        ? `군것질 ${details.diet.snackFrequency}회`
        : `야식 ${details.diet.lateNightSnackFrequency || "미입력"}회`,
  };
}

export default function HomeCoachBrief({ isLoggedIn }: HomeCoachBriefProps) {
  const [saveAlertKey, setSaveAlertKey] = useState(0);
  const [activeModalFocus, setActiveModalFocus] = useState<BriefMetricKey | null>(null);
  const briefDetails = useWellnessStore((state) => state.briefDetails);
  const saveBriefDetails = useWellnessStore((state) => state.saveBriefDetails);
  const setActiveFocus = useWellnessStore((state) => state.setActiveFocus);
  const hasHydrated = useWellnessStore((state) => state.hasHydrated);
  const hasAnyDetails = briefScoreCards.some((card) => hasBriefDetails(card.key, briefDetails));
  const statusLabel = !hasHydrated
    ? "저장된 브리핑 지표를 불러오는 중이에요."
    : hasAnyDetails
      ? "카드를 클릭하면 브리핑 지표를 수정할 수 있어요."
      : "카드를 클릭해서 브리핑 지표를 입력해보세요.";

  function handleCardClick(key: BriefMetricKey) {
    setActiveFocus(key);
    setActiveModalFocus(key);
  }

  function handleDetailSave(key: BriefMetricKey, value: BriefDetails[BriefMetricKey]) {
    saveBriefDetails(key, value);
    setActiveModalFocus(null);
    setSaveAlertKey((current) => current + 1);
  }

  return (
    <>
      {activeModalFocus ? (
        <DailySurveyDialog
          key={activeModalFocus}
          focus={activeModalFocus}
          details={briefDetails}
          onClose={() => setActiveModalFocus(null)}
          onSave={handleDetailSave}
        />
      ) : null}

      <SaveAlert
        openKey={saveAlertKey}
        onClose={() => setSaveAlertKey(0)}
        description="브리핑 입력값이 카드와 우선순위 패널에 저장되었어요."
      />

      <aside className="dark-panel dark-panel-wrapper ui-hover-panel-dark rise-in-delay">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="dark-panel-kicker">Today&apos;s brief</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">오늘의 코치 브리핑</h2>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="mt-7 rounded-[1.6rem] border border-white/10 bg-white/8 p-6">
            <p className="mt-3 text-2xl font-semibold tracking-tight">로그인하면 오늘 브리핑을 볼 수 있어요.</p>
            <p className="mt-3 text-sm leading-7 text-white/80">
              회원가입 후 기본 정보와 온보딩을 입력하면
              <br />
              수면, 운동, 식단 흐름에 맞춘 개인 브리핑이 홈에서 바로 이어집니다.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="ui-button-primary ui-button-primary-wide">
                회원가입
              </Link>
              <Link href="/login" className="ui-pill" style={{ backgroundColor: "#fff" }}>
                로그인
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-7 rounded-[1.6rem] border border-white/10 bg-white/8 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_18px_30px_rgba(14,26,24,0.18)]">
              <p className="dark-panel-label">핵심 포커스</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">Recovery First</p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                어제 운동량은 충분했습니다. 오늘은 수면 질을 지키고 점심 이후 걷기를 더해 에너지 흐름을 매끈하게 만드는
                편이 좋아요.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {todayChecklist.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.3rem] border border-white/10 bg-white/6 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_16px_28px_rgba(14,26,24,0.16)]"
                >
                  <p className="text-sm leading-7 text-white/88">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
              {briefScoreCards.map((card) => {
                const summary = getCardContent(card.key, briefDetails);

                return (
                  <button
                    key={card.label}
                    type="button"
                    onClick={() => handleCardClick(card.key)}
                    className="rounded-[1.3rem] px-4 py-4 text-left text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(14,26,24,0.16)]"
                    style={{ backgroundColor: card.tint }}
                  >
                    <p className="text-base font-bold">{card.label}</p>

                    {summary ? (
                      <>
                        <p className="mt-2 text-base font-normal">{summary.primary}</p>
                        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{card.emptyHint}</p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">--</p>
                        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{card.emptyHint}</p>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <p className="dark-panel-label">{statusLabel}</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
