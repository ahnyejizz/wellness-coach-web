import type { LocalUserProfile } from "@/lib/auth/user-store";
import { hasCompletedOnboarding } from "@/lib/auth/user-store";

/*
현재 사용자 온보딩 완료 여부와 돌아갈 경로를 기준으로
온보딩 진입 링크를 일관되게 생성
*/
export function getOnboardingHref(
  profile: LocalUserProfile | null | undefined,
  callbackUrl: string,
) {
  const params = new URLSearchParams({
    callbackUrl,
  });

  if (profile && hasCompletedOnboarding(profile)) {
    params.set("mode", "edit");
  }

  return `/onboarding?${params.toString()}`;
}
