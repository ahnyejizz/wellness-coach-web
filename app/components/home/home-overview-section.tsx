import Link from "next/link";

import HomeCoachBrief from "./home-coach-brief";
import { LockGlyph } from "../common/Icon";

const heroSignals = [
  { label: "수면 루틴", value: "회복 흐름 정리", hint: "취침 시간과 회복 패턴을 함께 봅니다." },
  { label: "운동 계획", value: "주간 루틴 설계", hint: "강도와 빈도를 무리 없이 맞춥니다." },
  { label: "식단 관리", value: "식사 균형 가이드", hint: "단백질, 수분, 식사 흐름을 함께 관리합니다." },
];

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

type HomeHeroSectionProps = {
  isLoggedIn: boolean;
};

export default function HomeOverviewSection({ isLoggedIn }: HomeHeroSectionProps) {
  return (
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

        <div className="flex flex-col gap-3 sm:flex-row">
          {isLoggedIn ? (
            <Link href="/coach" className="ui-button-primary ui-button-primary-wide">
              내 코치 페이지로 이동
            </Link>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {isLoggedIn
            ? heroSignals.map((signal) => (
                <article key={signal.label} className="ui-card-compact rounded-[1.4rem]">
                  <p className="text-sm text-[var(--muted)]">{signal.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{signal.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--accent-strong)]">{signal.hint}</p>
                </article>
              ))
            : guestSignalPreviews.map((signal) => (
                <article key={signal.label} className="ui-card-compact rounded-[1.4rem]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--muted)]">{signal.label}</p>
                  </div>
                  <div className="relative mt-5 rounded-[1.3rem] border border-[var(--border)] bg-white/68 p-4">
                    <div className="space-y-3 opacity-55 blur-[0.5px]">
                      <div className="h-3 rounded-full" style={{ width: "74%", backgroundColor: signal.softAccent }} />
                      <div className="h-3 rounded-full" style={{ width: "88%", backgroundColor: signal.softAccent }} />
                      <div className="h-3 rounded-full" style={{ width: "61%", backgroundColor: signal.softAccent }} />
                    </div>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 shadow-[0_10px_24px_rgba(21,42,36,0.08)]"
                        style={{ backgroundColor: signal.accent }}
                      >
                        <LockGlyph className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[var(--muted)]">로그인 후 확인할 수 있어요.</p>
                </article>
              ))}
        </div>
      </div>

      {/* 오늘의 코치 브리핑 */}
      <HomeCoachBrief isLoggedIn={isLoggedIn} />
    </div>
  );
}
