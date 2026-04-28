import Link from "next/link";

import { signOut } from "@/auth";

const homeSectionLinks = [
  { href: "#coach-areas", label: "코칭 영역" },
  { href: "#coach-board", label: "코치 보드" },
  { href: "#report", label: "주간 리포트" },
] as const;

type HomeHeaderProps = {
  isLoggedIn: boolean;
  userName: string;
};

export default function HomeHeader({ isLoggedIn, userName }: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="ui-brand-chip">Motive Care</span>
        <span className="text-sm text-[var(--muted)]">Personal Health Coach for sleep, workout, diet</span>
      </div>

      <nav className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
        {homeSectionLinks.map((link) => (
          <a key={link.href} href={link.href} className="ui-pill">
            {link.label}
          </a>
        ))}

        {isLoggedIn ? (
          <>
            <Link href="/coach" className="ui-pill">
              마이페이지
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="ui-button-primary ui-button-primary-compact text-[#fffaf2]">
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="ui-pill">
              로그인
            </Link>
            <Link href="/signup" className="ui-button-primary ui-button-primary-compact text-white">
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
