export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/coach/:path*", "/ai-chat/:path*", "/plan/:path*", "/login", "/signup"],
};
