import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

import { verifyUserCredentials } from "@/lib/auth/user-store";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string" ? credentials.email : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

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
