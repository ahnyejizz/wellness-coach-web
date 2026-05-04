"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type LogoutAlertProps = {
  show: boolean;
};

export default function LogoutAlert({ show }: LogoutAlertProps) {
  const router = useRouter();

  useEffect(() => {
    if (!show) {
      return;
    }

    const cleanupTimer = window.setTimeout(() => {
      router.replace("/", { scroll: false });
    }, 2600);

    return () => {
      window.clearTimeout(cleanupTimer);
    };
  }, [router, show]);

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,31,28,0.34)] px-4 backdrop-blur-[3px]"
      onClick={() => {
        router.replace("/", { scroll: false });
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        className="pointer-events-auto rise-in w-full max-w-lg rounded-[1.75rem] border border-[var(--border)] bg-[color:rgba(255,250,242,0.98)] p-4 shadow-[0_32px_64px_rgba(21,42,36,0.22)] sm:p-5"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-lg font-semibold text-[#fffaf2] shadow-[0_14px_30px_rgba(21,42,36,0.16)]">
            ✓
          </div>

          <div className="min-w-0 flex-1">
            <p className="ui-kicker">Signed out</p>
            <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              로그아웃 되었습니다.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              필요하면 언제든 다시 로그인해서 코칭을 이어갈 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            aria-label="로그아웃 알림 닫기"
            className="ui-pill h-10 min-w-10 px-0 text-base leading-none"
            onClick={() => {
              router.replace("/", { scroll: false });
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
