export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/onboarding/:path*", "/plan/:path*", "/coach/:path*", "/ai-chat/:path*", "/login", "/signup"],
};
