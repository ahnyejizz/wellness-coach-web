"use client";

import {
  clampProteinTarget,
  clampWaterTarget,
  clampWorkoutDays,
  getPlanDisplayName,
  getSavedPlanLabel,
  type FocusKey,
  type GoalKey,
  type MealPatternKey,
  useWellnessStore,
} from "@/app/stores/wellness-store";

export default function HomeCoachPlanStudio() {
  const profile = useWellnessStore((state) => state.profile);
  const hasHydrated = useWellnessStore((state) => state.hasHydrated);
  const lastSavedAt = useWellnessStore((state) => state.lastSavedAt);
  const updateProfile = useWellnessStore((state) => state.updateProfile);
  const saveProfile = useWellnessStore((state) => state.saveProfile);
  const resetProfile = useWellnessStore((state) => state.resetProfile);
  const savedLabel = getSavedPlanLabel(lastSavedAt, hasHydrated);

  return (
    <article className="panel ui-panel-shell transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(21,42,36,0.12)]">
      <p className="ui-kicker">Plan studio</p>
      <h2 className="ui-title-3 mt-3">내 루틴에 맞는 웰니스 코칭 플랜 만들기</h2>
      <p className="ui-copy mt-4 max-w-3xl">
        목표와 루틴을 입력하면, 수면·운동·식단 우선순위에 맞춘 개인 코칭 플랜을 바로 만들어줍니다.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="ui-field-label">이름</span>
          <input
            className="ui-field-control-strong"
            value={profile.name}
            onChange={(event) => updateProfile("name", event.target.value)}
            placeholder={getPlanDisplayName(profile.name)}
          />
        </label>

        <label className="block">
          <span className="ui-field-label">핵심 목표</span>
          <select
            className="ui-field-control-strong"
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
          <span className="ui-field-label">우선 코칭</span>
          <select
            className="ui-field-control-strong"
            value={profile.focus}
            onChange={(event) => updateProfile("focus", event.target.value as FocusKey)}
          >
            <option value="sleep">수면</option>
            <option value="exercise">운동</option>
            <option value="diet">식단</option>
          </select>
        </label>

        <label className="block">
          <span className="ui-field-label">기본 식사 스타일</span>
          <select
            className="ui-field-control-strong"
            value={profile.mealPattern}
            onChange={(event) => updateProfile("mealPattern", event.target.value as MealPatternKey)}
          >
            <option value="balanced">균형 식사</option>
            <option value="protein-forward">단백질 우선 식사</option>
            <option value="gentle-balance">부담 없는 식사</option>
          </select>
        </label>

        <label className="block">
          <span className="ui-field-label">목표 취침 시간</span>
          <input
            type="time"
            className="ui-field-control-strong"
            value={profile.bedtime}
            onChange={(event) => updateProfile("bedtime", event.target.value)}
          />
        </label>

        <label className="block">
          <span className="ui-field-label">주간 운동 횟수</span>
          <input
            type="number"
            min={2}
            max={6}
            className="ui-field-control-strong"
            value={profile.workoutDays}
            onChange={(event) =>
              updateProfile("workoutDays", clampWorkoutDays(Number.parseInt(event.target.value, 10) || 2))
            }
          />
        </label>

        <label className="block">
          <span className="ui-field-label">하루 단백질 목표</span>
          <input
            type="number"
            min={60}
            max={180}
            className="ui-field-control-strong"
            value={profile.proteinTarget}
            onChange={(event) =>
              updateProfile("proteinTarget", clampProteinTarget(Number.parseInt(event.target.value, 10) || 60))
            }
          />
        </label>

        <label className="block">
          <span className="ui-field-label">하루 수분 목표 (L)</span>
          <input
            type="number"
            min={1}
            max={4}
            step={0.1}
            className="ui-field-control-strong"
            value={profile.waterTarget}
            onChange={(event) =>
              updateProfile("waterTarget", clampWaterTarget(Number.parseFloat(event.target.value) || 1))
            }
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">{savedLabel}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            입력값은 자동으로 유지되고, 저장 버튼은 현재 플랜에 기준 시각을 남깁니다.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={resetProfile}
            className="ui-button-secondary ui-button-secondary-wide sm:min-w-[7.5rem]"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={saveProfile}
            className="ui-button-primary ui-button-primary-wide sm:min-w-[7.5rem]"
          >
            저장
          </button>
        </div>
      </div>
    </article>
  );
}
