"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { WELLNESS_COLORS } from "@/app/constants/colors";
import SaveAlert from "@/app/components/common/alert/save-alert";
import { MealIcon, SleepIcon, type IconProps, WorkoutIcon } from "@/app/components/icon/icon";
import DailySurveyDialog from "@/app/components/plan/daily-survey-dialog";
import { type BriefDetails, type BriefMetricKey, useWellnessStore } from "@/app/stores/wellness-store";

const quickBriefActions = [
  {
    key: "sleep",
    label: "수면 지표 입력",
    description: "총 수면 시간, 스크린 오프, 취침 준비 루틴, 기상 후 햇빛 노출",
    accent: WELLNESS_COLORS.sleep.accent,
    softAccent: WELLNESS_COLORS.sleep.softAccent,
    icon: SleepIcon,
  },
  {
    key: "exercise",
    label: "운동 지표 입력",
    description: "주간 근력 횟수, 주간 유산소 횟수, 활동 칼로리, 회복 상태",
    accent: WELLNESS_COLORS.exercise.accent,
    softAccent: WELLNESS_COLORS.exercise.softAccent,
    icon: WorkoutIcon,
  },
  {
    key: "diet",
    label: "식단 지표 입력",
    description: "단백질 섭취량, 수분 섭취량, 군것질 횟수, 야식 빈도",
    accent: WELLNESS_COLORS.diet.accent,
    softAccent: WELLNESS_COLORS.diet.softAccent,
    icon: MealIcon,
  },
] as const satisfies ReadonlyArray<{
  key: BriefMetricKey;
  label: string;
  description: string;
  accent: string;
  softAccent: string;
  icon: ComponentType<IconProps>;
}>;

function hasSleepDetails(details: BriefDetails["sleep"]) {
  return Boolean(
    details.totalSleepDuration || details.screenOffTime || details.sleepPrepRoutine || details.morningSunlight,
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

export default function DailySurveyPanel() {
  const [activeModalFocus, setActiveModalFocus] = useState<BriefMetricKey | null>(null);
  const [saveAlertKey, setSaveAlertKey] = useState(0);
  const briefDetails = useWellnessStore((state) => state.briefDetails);
  const saveBriefDetails = useWellnessStore((state) => state.saveBriefDetails);
  const setActiveFocus = useWellnessStore((state) => state.setActiveFocus);
  const completedCount = useMemo(
    () => quickBriefActions.filter((action) => hasBriefDetails(action.key, briefDetails)).length,
    [briefDetails],
  );

  function handleActionOpen(key: BriefMetricKey) {
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
        description="입력값이 오늘의 코치 브리핑과 우선순위 패널에 저장되었어요."
      />

      <section className="panel ui-panel-shell-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="ui-kicker">Quick Brief Input</p>
            <h2 className="ui-title-3 mt-3">지표를 바로 기록해보세요!</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              각 버튼을 누르면 해당 지표를 입력할 수 있는 팝업이 열리고,
              <br />
              입력하신 지표 데이터들은 각 패널에도 즉각 반영됩니다.
            </p>
          </div>

          <div className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
            {completedCount}/3 기록됨
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {quickBriefActions.map((action) => {
            const Icon = action.icon;
            const hasData = hasBriefDetails(action.key, briefDetails);

            return (
              <button
                key={action.key}
                type="button"
                onClick={() => handleActionOpen(action.key)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[1.35rem] border border-[var(--border)] bg-white px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(21,42,36,0.1)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full"
                    style={{
                      backgroundColor: action.softAccent,
                      color: action.accent,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-tight text-[var(--foreground)]">{action.label}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{action.description}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className="inline-flex cursor-pointer rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: action.softAccent,
                      color: action.accent,
                    }}
                  >
                    {hasData ? "수정하기" : "입력하기"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
