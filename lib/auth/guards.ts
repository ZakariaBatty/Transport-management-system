import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Auth Guards - Centralized route protection utilities
 * Use these guards in server components to enforce authentication and authorization
 */

export type UserRole = "DRIVER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";

export interface AuthSession {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

/**
 * Ensure user is authenticated
 * Redirects to login if not authenticated
 */
export async function ensureAuthenticated(): Promise<AuthSession> {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return {
    id: session.user.id as string,
    email: session.user.email as string,
    role: (session.user as any).role as UserRole,
    name: (session.user as any).name as string,
  };
}

/**
 * Ensure user has specific role(s)
 * Redirects to dashboard if role not authorized
 */
export async function ensureRole(
  allowedRoles: UserRole | UserRole[]
): Promise<AuthSession> {
  const session = await ensureAuthenticated();

  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (!rolesArray.includes(session.role)) {
    // Redirect based on role
    if (session.role === "DRIVER") {
      redirect("/driver/dashboard");
    }
    redirect("/dashboard");
  }

  return session;
}

/**
 * Ensure user is driver
 * Redirects if not a driver
 */
export async function ensureDriver(): Promise<AuthSession> {
  return ensureRole("DRIVER");
}

/**
 * Ensure user is manager or higher
 * Redirects if not manager/admin/super_admin
 */
export async function ensureManager(): Promise<AuthSession> {
  return ensureRole(["MANAGER", "ADMIN", "SUPER_ADMIN"]);
}

/**
 * Ensure user is admin or higher
 * Redirects if not admin/super_admin
 */
export async function ensureAdmin(): Promise<AuthSession> {
  return ensureRole(["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Ensure user is super admin
 * Redirects if not super admin
 */
export async function ensureSuperAdmin(): Promise<AuthSession> {
  return ensureRole("SUPER_ADMIN");
}

/**
 * Get current session without redirect
 * Returns null if not authenticated
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id as string,
    email: session.user.email as string,
    role: (session.user as any).role as UserRole,
    name: (session.user as any).name as string,
  };
}

/**
 * Check if user has specific role(s) without redirect
 * Returns boolean
 */
export async function hasRole(
  allowedRoles: UserRole | UserRole[]
): Promise<boolean> {
  const session = await getCurrentSession();

  if (!session) {
    return false;
  }

  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  return rolesArray.includes(session.role);
}

/**
 * Check if user is driver
 */
export async function isDriver(): Promise<boolean> {
  return hasRole("DRIVER");
}

/**
 * Check if user is manager or higher
 */
export async function isManager(): Promise<boolean> {
  return hasRole(["MANAGER", "ADMIN", "SUPER_ADMIN"]);
}

/**
 * Check if user is admin or higher
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Check if user is super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole("SUPER_ADMIN");
}
