import Link from "next/link";

import { signOut } from "@/auth";

type HomeHeaderProps = {
  isLoggedIn: boolean;
  userName: string;
};

export default function HomeHeader({
  isLoggedIn,
  userName,
}: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
          Motive Care
        </span>
        <span className="text-sm text-[var(--muted)]">
          Personal Health Coach for sleep, workout, diet
        </span>
      </div>

      <nav className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
        <a
          href="#pillars"
          className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
        >
          코칭 영역
        </a>
        <a
          href="#coach-board"
          className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
        >
          코치 보드
        </a>
        <a
          href="#report"
          className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
        >
          주간 리포트
        </a>

        {isLoggedIn ? (
          <>
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 text-[var(--foreground)]">
              {userName}님
            </span>
            <Link
              href="/coach"
              className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
            >
              내 코치 페이지
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-full bg-[var(--foreground)] px-4 py-2 font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
              >
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 transition-colors duration-200 hover:bg-white"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[var(--foreground)] px-4 py-2 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
