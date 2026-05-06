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

export function WeightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M7 4.75h10a3.25 3.25 0 0 1 3.25 3.25v8A3.25 3.25 0 0 1 17 19.25H7A3.25 3.25 0 0 1 3.75 16V8A3.25 3.25 0 0 1 7 4.75Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M8.5 12.25a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="m12 12.25 2.35-1.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="12" cy="12.25" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function SleepIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M14.5 4.75a6.75 6.75 0 1 0 4.8 11.5 5.9 5.9 0 1 1-4.8-11.5Z" fill="currentColor" />
      <path d="M17.5 5v1.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M16.7 5.8h1.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function WorkoutIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M5.25 9.75H7v4.5H5.25a1 1 0 0 1-1-1v-2.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M17 9.75h1.75a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H17v-4.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M8.1 8v8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M15.9 8v8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M7 10.75h10v2.5H7z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

export function MealIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 8.5c1.15-2.1 3.05-3.3 5.1-3.3-.1 2.15-1.25 3.85-3.4 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.1 9.25c1.6 0 2.68.72 3.4 1.58.72-.86 1.8-1.58 3.4-1.58 2.47 0 4.35 1.98 4.35 4.52 0 4.12-3.48 6.48-7.75 6.48s-7.75-2.36-7.75-6.48c0-2.54 1.88-4.52 4.35-4.52Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M4.75 10.25 12 4.75l7.25 5.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 9.8v8.45c0 .55.45 1 1 1h8.5c.55 0 1-.45 1-1V9.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M10 19.25V13.5h4v5.75" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}
