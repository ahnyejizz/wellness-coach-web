"use client";

type ResetConfirmAlertProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ResetConfirmAlert({ open, onClose, onConfirm }: ResetConfirmAlertProps) {
  if (!open) {
    return null;
  }

  return (
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
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-lg font-semibold text-[var(--accent-strong)] shadow-[0_14px_30px_rgba(21,42,36,0.1)]">
            !
          </div>

          <div className="min-w-0 flex-1">
            <p className="ui-kicker">Reset</p>
            <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              정말 초기화하시겠습니까?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              초기화 시 오늘의 코치 브리핑 카드에서도 즉시 초기화 됩니다.
            </p>
          </div>

          <button
            type="button"
            aria-label="초기화 확인 알림 닫기"
            className="ui-pill h-10 min-w-10 px-0 text-base leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="ui-button-secondary ui-button-secondary-wide">
            취소
          </button>
          <button type="button" onClick={onConfirm} className="ui-button-primary ui-button-primary-wide">
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
