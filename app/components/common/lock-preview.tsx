import { LockGlyph } from "./Icon";

type LockPreviewProps = {
  accent: string;
  softAccent: string;
  className?: string;
  theme?: "light" | "dark";
  lineWidths?: string[];
  lineColor?: string;
  lineAlign?: "start" | "center";
  boxClassName?: string;
  previewAreaClassName?: string;
  lineClassName?: string;
  message?: string;
  messageClassName?: string;
  messageInside?: boolean;
};

export default function LockPreview({
  accent,
  softAccent,
  className = "",
  theme = "light",
  lineWidths = ["74%", "88%", "61%"],
  lineColor,
  lineAlign = "start",
  boxClassName = "p-4",
  previewAreaClassName = "",
  lineClassName = "h-3 rounded-full",
  message = "로그인 후 확인할 수 있어요.",
  messageClassName = "mt-3 text-xs text-[var(--muted)]",
  messageInside = false,
}: LockPreviewProps) {
  const isDark = theme === "dark";
  const resolvedLineColor = lineColor ?? softAccent;
  const boxBaseClassName = isDark
    ? "rounded-[1.2rem] border border-white/10 bg-white/6"
    : "rounded-[1.2rem] border border-[var(--border)] bg-white/68";
  const iconBaseClassName = isDark
    ? "flex h-11 w-11 items-center justify-center rounded-full border border-white/18"
    : "flex h-10 w-10 items-center justify-center rounded-full border border-white/80 shadow-[0_10px_24px_rgba(21,42,36,0.08)]";
  const iconStyle = isDark
    ? {
        backgroundColor: accent,
        boxShadow: `0 0 0 10px ${softAccent}, 0 12px 24px rgba(14,26,24,0.18)`,
      }
    : { backgroundColor: accent };

  return (
    <div className={className}>
      <div className={`${boxBaseClassName} ${boxClassName}`.trim()}>
        <div className={`relative ${previewAreaClassName}`.trim()}>
          <div className="space-y-3 opacity-55 blur-[0.5px]">
            {lineWidths.map((width, index) => (
              <div
                key={`${width}-${index}`}
                className={`${lineClassName} ${lineAlign === "center" ? "mx-auto" : ""}`.trim()}
                style={{ width, backgroundColor: resolvedLineColor }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className={iconBaseClassName} style={iconStyle}>
              <LockGlyph className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        {messageInside ? <p className={`text-center ${messageClassName}`.trim()}>{message}</p> : null}
      </div>
      {!messageInside ? <p className={`text-center ${messageClassName}`.trim()}>{message}</p> : null}
    </div>
  );
}
