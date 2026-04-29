import NextAuth, { customFetch } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import { NextResponse } from "next/server";

import { ensureSocialUser, verifyUserCredentials } from "@/lib/auth/user-store";

function buildSocialAliasEmail(provider: string, providerAccountId: string) {
  return `${provider}-${providerAccountId}@users.motive-care.local`;
}

function resolveSocialEmail(provider: string, providerAccountId: string, email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();
  return normalizedEmail || buildSocialAliasEmail(provider, providerAccountId);
}

function getNaverTokenRequestState(request: Request | undefined) {
  if (!request) {
    return null;
  }

  try {
    return new URL(request.url).searchParams.get("state");
  } catch {
    return null;
  }
}

function appendStateToTokenRequest(body: BodyInit | null | undefined, state: string) {
  if (!body) {
    return body;
  }

  const params =
    typeof body === "string"
      ? new URLSearchParams(body)
      : body instanceof URLSearchParams
        ? new URLSearchParams(body)
        : null;

  if (!params) {
    return body;
  }

  if (!params.has("state")) {
    params.set("state", state);
  }

  return params;
}

export const { handlers, auth, signIn, signOut } = NextAuth((request) => {
  const naverState = getNaverTokenRequestState(request);

  return {
    providers: [
      Google,
      Kakao({
        authorization: {
          url: "https://kauth.kakao.com/oauth/authorize?scope",
          params: {
            scope: "profile_nickname profile_image",
          },
        },
        profile(profile: {
          id?: number | string;
          kakao_account?: {
            profile?: {
              nickname?: string;
              profile_image_url?: string;
            };
          };
        }) {
          const providerAccountId = profile.id?.toString() ?? "kakao-user";
          const nickname = profile.kakao_account?.profile?.nickname?.trim();

          return {
            id: providerAccountId,
            name: nickname || "Kakao User",
            email: buildSocialAliasEmail("kakao", providerAccountId),
            image: profile.kakao_account?.profile?.profile_image_url,
          };
        },
      }),
      Naver({
        checks: ["state", "pkce"],
        client: {
          token_endpoint_auth_method: "client_secret_post",
        },
        profile(profile: {
          response?: {
            id?: string;
            nickname?: string;
            name?: string;
            email?: string;
            profile_image?: string;
          };
        }) {
          const providerAccountId = profile.response?.id?.trim() || "naver-user";
          const displayName = profile.response?.nickname?.trim() || profile.response?.name?.trim() || "회원";

          return {
            id: providerAccountId,
            name: displayName,
            email: resolveSocialEmail("naver", providerAccountId, profile.response?.email),
            image: profile.response?.profile_image,
          };
        },
        [customFetch]: (input, init) => {
          const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

          if (!naverState || url !== "https://nid.naver.com/oauth2.0/token") {
            return fetch(input, init);
          }

          return fetch(input, {
            ...init,
            body: appendStateToTokenRequest(init?.body, naverState),
          });
        },
      }),
      Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email = typeof credentials.email === "string" ? credentials.email : "";
          const password = typeof credentials.password === "string" ? credentials.password : "";

          if (!email || !password) {
            return null;
          }

          const user = await verifyUserCredentials(email, password);

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        },
      }),
    ],
    trustHost: true,
    secret: process.env.AUTH_SECRET ?? "motive-care-local-development-secret",
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async signIn({ user, account }) {
        if (account?.provider === "credentials") {
          return true;
        }

        const resolvedEmail =
          user.email ||
          (account?.provider && account.providerAccountId
            ? buildSocialAliasEmail(account.provider, account.providerAccountId)
            : "");

        if (!resolvedEmail) {
          return "/login?error=social_email_required";
        }

        await ensureSocialUser({
          email: resolvedEmail,
          name: user.name,
        });

        return true;
      },
      authorized({ auth, request }) {
        const isLoggedIn = !!auth?.user;
        const pathname = request.nextUrl.pathname;
        const isCoachArea = pathname.startsWith("/coach");
        const isAuthPage = pathname === "/login" || pathname === "/signup";

        if (isCoachArea) {
          return isLoggedIn;
        }

        if (isAuthPage && isLoggedIn) {
          return NextResponse.redirect(new URL("/coach", request.url));
        }

        return true;
      },
    },
  };
});
