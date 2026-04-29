import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import { NextResponse } from "next/server";

import { ensureSocialUser, verifyUserCredentials } from "@/lib/auth/user-store";

function buildSocialAliasEmail(provider: string, providerAccountId: string) {
  return `${provider}-${providerAccountId}@users.motive-care.local`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    Naver,
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

      if (!user.email) {
        return "/login?error=social_email_required";
      }

      await ensureSocialUser({
        email: user.email,
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
});
