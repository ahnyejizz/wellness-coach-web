export type IconProps = {
  className?: string;
};

export function LockGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.5 6V4.75a2.5 2.5 0 1 1 5 0V6h.75c.41 0 .75.34.75.75v4.5c0 .41-.34.75-.75.75h-6.5A.75.75 0 0 1 4 11.25v-4.5c0-.41.34-.75.75-.75h.75Zm1.5 0h2V4.75a1 1 0 1 0-2 0V6Z"
      />
    </svg>
  );
}
