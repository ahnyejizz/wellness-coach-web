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

export const focusOrder: FocusKey[] = ["sleep", "exercise", "diet"];

export const focusAreas: Record<FocusKey, FocusArea> = {
  sleep: {
    label: "수면 코칭",
    kicker: "깊은 회복과 일정한 기상",
    headline: "sleep priority",
    summary: "스크린 타임의 영향을 줄이고, 매일 비슷한 시간에 잠드는 패턴을 만드는 데 집중합니다.",
    score: "89",
    scoreLabel: "회복 점수",
    target: "23:10 취침, 07:00 기상",
    coachNote: "최근 4일 중 3일은 수면 시간이 충분했어요. 이제 핵심은 잠드는 시간을 더 일정하게 고정하는 것입니다.",
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
    headline: "workout priority",
    summary: "근력 운동, 유산소, 회복일 배치를 함께 보면서 몸이 무너지지 않는 주간 운동 패턴을 만듭니다.",
    score: "4/5",
    scoreLabel: "주간 세션",
    target: "근력 3회 + zone 2 유산소 2회",
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
    summary: "칼로리 숫자만 쫓기보다 단백질, 수분, 식사 간격을 정리해 하루 에너지가 끊기지 않도록 관리합니다.",
    score: "91%",
    scoreLabel: "식단 안정도",
    target: "단백질 110g, 수분 2.1L 유지",
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

type HomeFocusBoardProps = {
  isLoggedIn: boolean;
};

export default function HomeFocusBoard({ isLoggedIn }: HomeFocusBoardProps) {
  const activeFocus = useWellnessStore((state) => state.activeFocus);
  const setActiveFocus = useWellnessStore((state) => state.setActiveFocus);

  return (
    <article className="panel ui-panel-shell">
      <p className="ui-kicker">Focus board</p>
      <h2 id="coach-board-title" className="ui-title-3 mt-3">
        오늘의 플랜 우선순위를 선택하세요.
      </h2>
      <p className="ui-copy mt-4 max-w-2xl">
        수면, 운동, 식단 중 현재 우선순위를 바꾸면
        <br />
        해당 플랜에 대한 코치의 제안과 이번주 패턴이 함께 업데이트됩니다.
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
              className={`w-full rounded-[1.5rem] border p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(21,42,36,0.12)] ${
                isActive
                  ? "border-transparent bg-[var(--foreground)] text-[#fffaf2] shadow-xl"
                  : "border-[var(--border)] bg-white/65 text-[var(--foreground)] hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm ${isActive ? "text-white/70" : "text-[var(--muted)]"}`}>{area.kicker}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{area.label}</h3>
                  <p className={`mt-3 text-sm leading-7 ${isActive ? "text-white/80" : "text-[var(--muted)]"}`}>
                    {area.summary}
                  </p>
                </div>
                {isLoggedIn ? (
                  <div
                    className="rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.16)" : area.softAccent,
                      color: isActive ? "#fffaf2" : area.accent,
                    }}
                  >
                    {area.score}
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </article>
  );
}
