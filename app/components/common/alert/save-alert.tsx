"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type SaveAlertProps = {
  openKey: number;
  onClose: () => void;
  description?: string;
  title?: string;
};

export default function SaveAlert({
  openKey,
  onClose,
  description = "입력한 설정이 현재 저장 상태로 반영되었어요.",
  title = "저장되었습니다.",
}: SaveAlertProps) {
  useEffect(() => {
    if (openKey === 0) {
      return;
    }

    const cleanupTimer = window.setTimeout(() => {
      onClose();
    }, 2600);

    return () => {
      window.clearTimeout(cleanupTimer);
    };
  }, [onClose, openKey]);

  if (openKey === 0) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,31,28,0.34)] px-4 backdrop-blur-[3px]"
      onClick={onClose}
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
            <p className="ui-kicker">Saved</p>
            <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
          </div>

          <button
            type="button"
            aria-label="저장 알림 닫기"
            className="ui-pill h-10 min-w-10 px-0 text-base leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
