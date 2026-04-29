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
      "w-full rounded-[1.25rem] border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(21,42,36,0.1)]",
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
      {socialProviders.map((provider) => (
        <form key={provider.id} action={signInWithSocial.bind(null, provider.id, callbackUrl)}>
          <button type="submit" className={provider.className}>
            {provider.label}
            {actionLabel}
          </button>
        </form>
      ))}
    </div>
  );
}
