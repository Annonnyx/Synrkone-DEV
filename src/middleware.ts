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
  "/dashboard": "USER",
  "/profile": "USER",
  "/projects": "USER",
  "/website-creator": "USER",
  "/my-box": "DEV",
  "/boxes": "ADMIN",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("🔧 Middleware", { pathname, url: request.url });
  
  // Exclure les routes OAuth et statiques
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    console.log("✅ Middleware: route excluded", { pathname });
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log("🔧 Middleware: token check", { hasToken: !!token, userEmail: token?.email });

  // Pas connecté → redirect signin
  if (!token) {
    const signInUrl = new URL("/login", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    console.log("🔄 Middleware: redirecting to login", { from: request.url, to: signInUrl.toString() });
    return NextResponse.redirect(signInUrl);
  }

  const userRole = (token.role as string) ?? "USER";

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
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/projects",
    "/website-creator",
    "/my-box",
    "/my-box/:path*",
    "/boxes",
    "/boxes/:path*",
  ],
};
