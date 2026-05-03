import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_HIERARCHY: Record<string, number> = {
  USER: 0,
  DEV: 1,
  ADMIN: 2,
  OWNER: 3,
};

// Routes protégées par rôle minimum
const PROTECTED_ROUTES: Record<string, string> = {
  "/dashboard/files": "USER",
  "/dashboard/code": "DEV",
  "/my-box": "DEV",
  "/boxes": "ADMIN",
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Pas connecté → redirect signin
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  const userRole = (token.role as string) ?? "USER";
  const pathname = request.nextUrl.pathname;

  // Vérifie chaque route protégée
  for (const [route, requiredRole] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if ((ROLE_HIERARCHY[userRole] ?? 0) < (ROLE_HIERARCHY[requiredRole] ?? 0)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-box/:path*",
    "/boxes/:path*",
  ],
};
