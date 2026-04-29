import { signInWithSocial } from "@/app/auth-actions";

type SocialAuthButtonsProps = {
  callbackUrl: string;
  mode: "login" | "signup";
};

const socialProviders = [
  {
    id: "google",
    label: "Google",
    className:
      "relative w-full overflow-hidden rounded-[1.25rem] border border-[#d9e2f1] bg-white px-4 py-3 text-sm font-semibold text-[#1f3b63] shadow-[inset_0_1px_0_rgba(255,255,255,0.84)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(66,133,244,0.2)]",
  },
  {
    id: "kakao",
    label: "Kakao",
    className:
      "w-full rounded-[1.25rem] border border-[#f3d75a] bg-[#fee500] px-4 py-3 text-sm font-semibold text-[#2e2b00] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(46,43,0,0.14)]",
  },
  {
    id: "naver",
    label: "Naver",
    className:
      "w-full rounded-[1.25rem] border border-[#03b050] bg-[#03c75a] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(3,86,40,0.18)]",
  },
] as const;

export default function SocialAuthButtons({ callbackUrl, mode }: SocialAuthButtonsProps) {
  const actionLabel = mode === "signup" ? "로 시작하기" : "로 계속하기";

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => {
        const isGoogle = provider.id === "google";

        return (
          <form key={provider.id} action={signInWithSocial.bind(null, provider.id, callbackUrl)}>
            <button type="submit" className={provider.className}>
              {isGoogle ? (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-1.5 left-1.5 w-1 rounded-full bg-[linear-gradient(180deg,#4285f4_0%,#ea4335_34%,#fbbc05_68%,#34a853_100%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-6 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-[#4285f4]/12 blur-xl"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-2 h-8 w-8 rounded-full bg-[#34a853]/14 blur-lg"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-1 right-14 h-7 w-7 rounded-full bg-[#fbbc05]/16 blur-lg"
                  />
                </>
              ) : null}

              <span className="relative flex items-center justify-center gap-3">
                {isGoogle ? (
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/92 shadow-[0_10px_20px_rgba(66,133,244,0.16)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.79-.07-1.55-.21-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.88c2.27-2.09 3.56-5.18 3.56-8.64Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.27v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.37l4-3.1Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.77c1.76 0 3.35.61 4.6 1.82l3.45-3.45C17.95 1.07 15.24 0 12 0A12 12 0 0 0 1.27 6.63l4 3.1c.95-2.85 3.6-4.96 6.73-4.96Z"
                      />
                    </svg>
                  </span>
                ) : null}

                <span>
                  {provider.label}
                  {actionLabel}
                </span>
              </span>
            </button>
          </form>
        );
      })}
    </div>
  );
}
