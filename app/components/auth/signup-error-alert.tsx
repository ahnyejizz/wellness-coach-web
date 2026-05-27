"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type SignupErrorAlertProps = {
  message: string;
  nextUrl: string;
  kicker: string;
  title: string;
  closeLabel: string;
};

export default function SignupErrorAlert({ message, nextUrl, kicker, title, closeLabel }: SignupErrorAlertProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    window.history.replaceState(null, "", nextUrl);
  }, [nextUrl]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,31,28,0.34)] px-4 backdrop-blur-[3px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-live="assertive"
        aria-labelledby="signup-error-alert-title"
        aria-describedby="signup-error-alert-description"
        className="pointer-events-auto rise-in w-full max-w-lg rounded-[1.75rem] border border-[rgba(220,95,62,0.2)] bg-[color:rgba(255,250,242,0.98)] p-4 shadow-[0_32px_64px_rgba(21,42,36,0.22)] sm:p-5"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-lg font-semibold text-[var(--accent-strong)] shadow-[0_14px_30px_rgba(21,42,36,0.1)]">
            !
          </div>

          <div className="min-w-0 flex-1">
            <p className="ui-kicker">{kicker}</p>
            <h2
              id="signup-error-alert-title"
              className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]"
            >
              {title}
            </h2>
            <p id="signup-error-alert-description" className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {message}
            </p>
          </div>

          <button
            type="button"
            aria-label={closeLabel}
            className="ui-pill h-10 min-w-10 px-0 text-base leading-none"
            onClick={() => {
              setOpen(false);
            }}
          >
            ×
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="ui-button-primary ui-button-primary-wide"
            onClick={() => {
              setOpen(false);
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
