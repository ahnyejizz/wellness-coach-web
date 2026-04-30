import Link from "next/link";

import HomeCoachBrief from "./home-coach-brief";

const heroSignals = [
  { label: "수면 회복 점수", value: "89", hint: "늦은 취침 2회만 줄여도 회복이 더 올라가요." },
  { label: "운동 계획 달성률", value: "4/5", hint: "근력 3회, 걷기 2회 루틴 유지 중" },
  { label: "식단 안정도", value: "91%", hint: "단백질과 수분 섭취가 꾸준해졌어요." },
];

type HomeHeroSectionProps = {
  isLoggedIn: boolean;
};

export default function HomeOverviewSection({ isLoggedIn }: HomeHeroSectionProps) {
  return (
    <div className="grid gap-8 pt-8 xl:grid-cols-[1.24fr_0.76fr]">
      <div className="space-y-7">
        <div className="max-w-4xl space-y-5">
          <p className="ui-kicker font-medium">Sleep, workout, diet coaching in one flow</p>
          <h1 className="headline-face max-w-4xl text-4xl leading-[1.12] tracking-[-0.025em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            몸 상태를 읽고
            <br />
            오늘의 웰니스 행동을 제안하는
            <br />
            개인 코치 웹사이트
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Motive Care는 수면, 운동, 식단 데이터를 따로 흩어두지 않고 하나의 흐름으로 연결합니다.
            <br />
            회복이 부족하면 운동 강도를 낮추고, 식단이 흔들리면 포만감 설계부터 다시 제안하는
            <br />
            개인 웰니스 코치형 웹서비스 입니다.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isLoggedIn ? (
            <Link href="/coach" className="ui-button-primary ui-button-primary-wide">
              내 코치 페이지로 이동
            </Link>
          ) : (
            <Link href="/signup" className="ui-button-primary ui-button-primary-wide">
              회원가입하고 시작하기
            </Link>
          )}
          <a href="#report" className="ui-button-secondary ui-button-secondary-wide">
            주간 리포트 보기
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {heroSignals.map((signal) => (
            <article key={signal.label} className="ui-card-compact rounded-[1.4rem]">
              <p className="text-sm text-[var(--muted)]">{signal.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{signal.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--accent-strong)]">{signal.hint}</p>
            </article>
          ))}
        </div>
      </div>

      {/* 오늘의 코치 브리핑 */}
      <HomeCoachBrief isLoggedIn={isLoggedIn} />
    </div>
  );
}
