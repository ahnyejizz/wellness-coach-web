"use client";

import { useWellnessStore, type FocusKey } from "@/app/stores/wellness-store";

type FocusMetric = {
  label: string;
  value: string;
  hint: string;
};

type FocusPattern = {
  label: string;
  value: number;
  caption: string;
};

export type FocusArea = {
  label: string;
  kicker: string;
  headline: string;
  summary: string;
  score: string;
  scoreLabel: string;
  target: string;
  coachNote: string;
  habits: string[];
  metrics: FocusMetric[];
  patterns: FocusPattern[];
  accent: string;
  softAccent: string;
};

export type FocusAreaMap = Record<FocusKey, FocusArea>;

const focusOrder: FocusKey[] = ["sleep", "exercise", "diet"];

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

export default function HomeFocusBoard() {
  const activeFocus = useWellnessStore((state) => state.activeFocus);
  const setActiveFocus = useWellnessStore((state) => state.setActiveFocus);
  const current = focusAreas[activeFocus];

  return (
    <section
      id="coach-board"
      className="grid gap-6 xl:grid-cols-[0.76fr_1.24fr]"
      aria-labelledby="coach-board-title"
    >
      <article className="panel ui-panel-shell">
        <p className="ui-kicker">
          Focus board
        </p>
        <h2
          id="coach-board-title"
          className="ui-title-3 mt-3"
        >
          오늘 가장 먼저 챙길 코칭을 선택하세요.
        </h2>
        <p className="ui-copy mt-4 max-w-2xl">
          수면, 운동, 식단 중 현재 우선순위를 바꾸면 코치의 제안과 이번 주 패턴이 함께 업데이트됩니다. 
          <br />
          플래너에서 고른 우선 코칭 축과도 실시간으로 동기화됩니다.
        </p>

        <div className="mt-8 space-y-3">
          {focusOrder.map((key) => {
            const area = focusAreas[key];
            const isActive = key === activeFocus;

            return (
              <button
                key={area.label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFocus(key)}
                className={`w-full rounded-[1.5rem] border p-5 text-left transition-all duration-200 ${
                  isActive
                    ? "border-transparent bg-[var(--foreground)] text-[#fffaf2] shadow-xl"
                    : "border-[var(--border)] bg-white/65 text-[var(--foreground)] hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-sm ${
                        isActive ? "text-white/70" : "text-[var(--muted)]"
                      }`}
                    >
                      {area.kicker}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {area.label}
                    </h3>
                    <p
                      className={`mt-3 text-sm leading-7 ${
                        isActive ? "text-white/80" : "text-[var(--muted)]"
                      }`}
                    >
                      {area.summary}
                    </p>
                  </div>
                  <div
                    className="rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.16)" : area.softAccent,
                      color: isActive ? "#fffaf2" : area.accent,
                    }}
                  >
                    {area.score}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </article>

      <article className="panel panel-strong ui-panel-shell">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em]" style={{ color: current.accent }}>
              {current.headline}
            </p>
            <h3 className="ui-title-3 mt-3">
              {current.target}
            </h3>
            <p className="ui-copy mt-4">
              {current.summary}
            </p>
          </div>

          <div
            className="rounded-[1.5rem] border border-[var(--border)] px-6 py-4 sm:min-w-[7rem]"
            style={{ backgroundColor: current.softAccent }}
          >
            <p className="text-base font-medium text-[var(--muted)]">{current.scoreLabel}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
              {current.score}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="ui-card-raised">
            <p className="text-sm font-medium text-[var(--muted)]">Coach note</p>
            <p className="mt-3 text-lg leading-8 text-[var(--foreground)]">
              {current.coachNote}
            </p>

            <div className="mt-6 space-y-3">
              {current.habits.map((habit) => (
                <div key={habit} className="ui-card-note flex items-start gap-3">
                  <span
                    className="mt-1 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: current.accent }}
                  />
                  <p className="text-sm leading-7 text-[var(--foreground)]">{habit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {current.metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="ui-card-compact"
                >
                  <p className="text-sm text-[var(--muted)]">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: current.accent }}>
                    {metric.hint}
                  </p>
                </article>
              ))}
            </div>

            <div className="ui-card-raised">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--muted)]">이번 주 패턴</p>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: current.softAccent, color: current.accent }}
                >
                  live coach
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {current.patterns.map((pattern) => (
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
      </article>
    </section>
  );
}
