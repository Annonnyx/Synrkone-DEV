import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export type UserRole = "USER" | "DEV" | "ADMIN" | "OWNER";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 0,
  DEV: 1,
  ADMIN: 2,
  OWNER: 3,
};

export function hasRole(userRole: string, requiredRole: UserRole): boolean {
  return (ROLE_HIERARCHY[userRole as UserRole] ?? 0) >= ROLE_HIERARCHY[requiredRole];
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireAuth();
  if (!hasRole(session.user.role, role)) redirect("/dashboard");
  return session;
}
