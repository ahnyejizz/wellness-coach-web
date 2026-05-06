"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";

import SaveAlert from "@/app/components/common/alert/save-alert";
import { MealIcon, SleepIcon, type IconProps, WorkoutIcon } from "@/app/components/icon/icon";
import HomeCoachBriefDetail from "@/app/components/home/home-coach-brief-detail";
import { type BriefDetails, type BriefMetricKey, useWellnessStore } from "@/app/stores/wellness-store";

import LockPreview from "../common/lock-preview";
import HomeCoachBrief from "./home-coach-brief";

const guestSignalPreviews = [
  {
    label: "수면",
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
  },
  {
    label: "운동",
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
  },
  {
    label: "식단",
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
  },
] as const;

const quickBriefActions = [
  {
    key: "sleep",
    label: "수면 지표 입력",
    description: "총 수면 시간, 스크린 오프, 취침 준비 루틴, 기상 후 햇빛 노출",
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
    icon: SleepIcon,
  },
  {
    key: "exercise",
    label: "운동 지표 입력",
    description: "주간 근력 횟수, 주간 유산소 횟수, 활동 칼로리, 회복 상태",
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
    icon: WorkoutIcon,
  },
  {
    key: "diet",
    label: "식단 지표 입력",
    description: "단백질 섭취량, 수분 섭취량, 군것질 횟수, 야식 빈도",
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
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

type HomeHeroSectionProps = {
  isLoggedIn: boolean;
};

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

export default function HomeOverviewSection({ isLoggedIn }: HomeHeroSectionProps) {
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
        <HomeCoachBriefDetail
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
        description="브리핑 입력값이 오늘의 코치 브리핑과 우선순위 패널에 저장되었어요."
      />

      <div className="grid gap-8 pt-8 xl:grid-cols-[1.24fr_0.76fr]">
        <div className="space-y-7">
          <div className="max-w-4xl space-y-5">
            <p className="ui-kicker font-medium">Sleep, workout, diet coaching in one flow</p>
            <h1 className="headline-face max-w-4xl text-[1.85rem] leading-[1.16] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.15rem] lg:text-[2.75rem]">
              Personalized Wellness & HealthCare
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Motive Care는 수면, 운동, 식단에 대한 헬스케어 데이터를 따로 흩어두지 않고 하나의 흐름으로 연결합니다.
              <br />
              회복이 부족하면 운동 강도를 낮추고, 식단이 흔들리면 포만감 설계부터 다시 제안하는
              <br />
              개인 맞춤형 웰니스 & 헬스케어 코치형 건강 관리 서비스 입니다.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="xl:max-w-[46rem]">
              <div className="rounded-[1.7rem] border border-[var(--border)] bg-white/72 p-5 shadow-[0_22px_40px_rgba(21,42,36,0.08)] backdrop-blur-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-lg">
                    <p className="ui-kicker">Quick Brief Input</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                      지표를 바로 기록해보세요!
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                      각 버튼을 누르면 해당 브리핑 팝업이 바로 열리고
                      <br />
                      오늘의 코치 브리핑 카드에도 함께 반영됩니다.
                    </p>
                  </div>

                  <div className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                    {completedCount}/3 기록됨
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {quickBriefActions.map((action) => {
                    const Icon = action.icon;
                    const hasData = hasBriefDetails(action.key, briefDetails);

                    return (
                      <button
                        key={action.key}
                        type="button"
                        onClick={() => handleActionOpen(action.key)}
                        className="flex w-full items-center justify-between gap-4 rounded-[1.35rem] border border-[var(--border)] bg-white px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(21,42,36,0.1)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: action.softAccent,
                              color: action.accent,
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </span>

                          <div className="min-w-0">
                            <p className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                              {action.label}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{action.description}</p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
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
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {guestSignalPreviews.map((signal) => (
                <article key={signal.label} className="ui-card-compact ui-hover-card rounded-[1.4rem]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--muted)]">{signal.label}</p>
                  </div>
                  <LockPreview
                    className="mt-5"
                    accent={signal.accent}
                    softAccent={signal.softAccent}
                    lineWidths={["74%", "88%", "61%"]}
                  />
                </article>
              ))}
            </div>
          )}
        </div>

        {/* 오늘의 코치 브리핑 */}
        <HomeCoachBrief isLoggedIn={isLoggedIn} />
      </div>
    </>
  );
}
