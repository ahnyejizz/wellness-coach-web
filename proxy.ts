export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/coach/:path*", "/login", "/signup"],
};
