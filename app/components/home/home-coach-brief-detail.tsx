"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  type BriefDetails,
  type BriefMetricKey,
  type DietBriefDetails,
  type ExerciseBriefDetails,
  type SleepBriefDetails,
} from "@/app/stores/wellness-store";

const focusLabels = {
  sleep: "수면",
  exercise: "운동",
  diet: "식단",
} satisfies Record<BriefMetricKey, string>;

type HomeCoachBriefDetailProps = {
  focus: BriefMetricKey | null;
  details: BriefDetails;
  onClose: () => void;
  onSave: (focus: BriefMetricKey, value: BriefDetails[BriefMetricKey]) => void;
};

export default function HomeCoachBriefDetail({ focus, details, onClose, onSave }: HomeCoachBriefDetailProps) {
  const [draft, setDraft] = useState<BriefDetails>(details);

  useEffect(() => {
    if (!focus) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [focus, onClose]);

  if (!focus || typeof document === "undefined") {
    return null;
  }

  const resolvedFocus = focus;

  function updateSleepDetail<Key extends keyof SleepBriefDetails>(key: Key, value: SleepBriefDetails[Key]) {
    setDraft((current) => ({
      ...current,
      sleep: {
        ...current.sleep,
        [key]: value,
      },
    }));
  }

  function updateExerciseDetail<Key extends keyof ExerciseBriefDetails>(key: Key, value: ExerciseBriefDetails[Key]) {
    setDraft((current) => ({
      ...current,
      exercise: {
        ...current.exercise,
        [key]: value,
      },
    }));
  }

  function updateDietDetail<Key extends keyof DietBriefDetails>(key: Key, value: DietBriefDetails[Key]) {
    setDraft((current) => ({
      ...current,
      diet: {
        ...current.diet,
        [key]: value,
      },
    }));
  }

  function handleSave() {
    onSave(resolvedFocus, draft[resolvedFocus]);
  }

  const title = `${focusLabels[resolvedFocus]} 브리핑 입력`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,31,28,0.4)] px-4 py-6 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coach-brief-detail-title"
        className="pointer-events-auto w-full max-w-2xl rounded-[1.75rem] border border-[var(--border)] bg-[color:rgba(255,250,242,0.98)] p-5 shadow-[0_32px_64px_rgba(21,42,36,0.22)] sm:p-6"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="ui-kicker">Coach Brief Input</p>
            <h2 id="coach-brief-detail-title" className="ui-title-3 mt-3">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              입력한 값은 오늘의 코치 브리핑 카드와 우선순위 상세 패널에 함께 반영됩니다.
            </p>
          </div>

          <button
            type="button"
            aria-label="브리핑 입력 팝업 닫기"
            className="ui-pill h-10 min-w-10 px-0 text-base leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {focus === "sleep" ? (
            <>
              <label className="block">
                <span className="ui-field-label">총 수면 시간</span>
                <input
                  type="text"
                  value={draft.sleep.totalSleepDuration}
                  onChange={(event) => updateSleepDetail("totalSleepDuration", event.target.value)}
                  className="ui-field-control mt-3"
                  placeholder="예: 7h 28m"
                />
              </label>

              <label className="block">
                <span className="ui-field-label">스크린 오프 시간대</span>
                <input
                  type="time"
                  value={draft.sleep.screenOffTime}
                  onChange={(event) => updateSleepDetail("screenOffTime", event.target.value)}
                  className="ui-field-control mt-3"
                />
              </label>

              <label className="block">
                <span className="ui-field-label">취침 준비 루틴 여부</span>
                <select
                  value={draft.sleep.sleepPrepRoutine}
                  onChange={(event) =>
                    updateSleepDetail("sleepPrepRoutine", event.target.value as SleepBriefDetails["sleepPrepRoutine"])
                  }
                  className="ui-field-control mt-3"
                >
                  <option value="">선택해주세요.</option>
                  <option value="done">실천 중</option>
                  <option value="not-yet">아직 못 했어요</option>
                </select>
              </label>

              <label className="block">
                <span className="ui-field-label">기상 후 햇빛 노출 여부</span>
                <select
                  value={draft.sleep.morningSunlight}
                  onChange={(event) =>
                    updateSleepDetail("morningSunlight", event.target.value as SleepBriefDetails["morningSunlight"])
                  }
                  className="ui-field-control mt-3"
                >
                  <option value="">선택해주세요.</option>
                  <option value="done">실천 중</option>
                  <option value="not-yet">아직 못 했어요</option>
                </select>
              </label>
            </>
          ) : null}

          {focus === "exercise" ? (
            <>
              <label className="block">
                <span className="ui-field-label">주간 근력 횟수</span>
                <div className="ui-field-shell mt-3">
                  <input
                    type="number"
                    min="0"
                    value={draft.exercise.strengthSessions}
                    onChange={(event) => updateExerciseDetail("strengthSessions", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                    placeholder="예: 3"
                  />
                  <span className="text-sm font-medium text-[var(--muted)]">회</span>
                </div>
              </label>

              <label className="block">
                <span className="ui-field-label">주간 유산소 횟수</span>
                <div className="ui-field-shell mt-3">
                  <input
                    type="number"
                    min="0"
                    value={draft.exercise.walkSessions}
                    onChange={(event) => updateExerciseDetail("walkSessions", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                    placeholder="예: 5"
                  />
                  <span className="text-sm font-medium text-[var(--muted)]">회</span>
                </div>
              </label>

              <label className="block">
                <span className="ui-field-label">활동 칼로리</span>
                <div className="ui-field-shell mt-3">
                  <input
                    type="number"
                    min="0"
                    value={draft.exercise.activeCalories}
                    onChange={(event) => updateExerciseDetail("activeCalories", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                    placeholder="예: 2640"
                  />
                  <span className="text-sm font-medium text-[var(--muted)]">kcal</span>
                </div>
              </label>

              <label className="block">
                <span className="ui-field-label">회복 상태</span>
                <select
                  value={draft.exercise.recoveryStatus}
                  onChange={(event) =>
                    updateExerciseDetail("recoveryStatus", event.target.value as ExerciseBriefDetails["recoveryStatus"])
                  }
                  className="ui-field-control mt-3"
                >
                  <option value="">선택해주세요.</option>
                  <option value="good">좋음</option>
                  <option value="steady">보통</option>
                  <option value="low">낮음</option>
                </select>
              </label>
            </>
          ) : null}

          {focus === "diet" ? (
            <>
              <label className="block">
                <span className="ui-field-label">단백질 섭취량</span>
                <div className="ui-field-shell mt-3">
                  <input
                    type="number"
                    min="0"
                    value={draft.diet.proteinIntake}
                    onChange={(event) => updateDietDetail("proteinIntake", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                    placeholder="예: 106"
                  />
                  <span className="text-sm font-medium text-[var(--muted)]">g</span>
                </div>
              </label>

              <label className="block">
                <span className="ui-field-label">수분 섭취량</span>
                <div className="ui-field-shell mt-3">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={draft.diet.waterIntake}
                    onChange={(event) => updateDietDetail("waterIntake", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                    placeholder="예: 2.1"
                  />
                  <span className="text-sm font-medium text-[var(--muted)]">L</span>
                </div>
              </label>

              <label className="block">
                <span className="ui-field-label">군것질 횟수</span>
                <div className="ui-field-shell mt-3">
                  <input
                    type="number"
                    min="0"
                    value={draft.diet.snackFrequency}
                    onChange={(event) => updateDietDetail("snackFrequency", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                    placeholder="예: 2"
                  />
                  <span className="text-sm font-medium text-[var(--muted)]">회</span>
                </div>
              </label>

              <label className="block">
                <span className="ui-field-label">야식 빈도</span>
                <div className="ui-field-shell mt-3">
                  <input
                    type="number"
                    min="0"
                    value={draft.diet.lateNightSnackFrequency}
                    onChange={(event) => updateDietDetail("lateNightSnackFrequency", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
                    placeholder="예: 1"
                  />
                  <span className="text-sm font-medium text-[var(--muted)]">회</span>
                </div>
              </label>
            </>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="ui-button-secondary ui-button-secondary-wide">
            취소
          </button>
          <button type="button" onClick={handleSave} className="ui-button-primary ui-button-primary-wide">
            저장
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
