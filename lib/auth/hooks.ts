import React from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { UserRole } from "@prisma/client";

/**
 * Custom hook to access session with typed user
 */
export function useAuthSession() {
  const { data: session, status, update } = useSession();

  return {
    session: session as
      | (Session & {
          user: Session["user"] & {
            id: string;
            role: UserRole;
            status: string;
          };
        })
      | null,
    status,
    update,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}

/**
 * Custom hook for role-based access checks
 */
export function useRoleAccess() {
  const { session } = useAuthSession();

  const role: UserRole | undefined = session?.user?.role;

  return {
    userRole: role,
    userId: session?.user?.id,
    isDriver: role === UserRole.DRIVER,
    isManager: role === UserRole.MANAGER,
    isAdmin: role === UserRole.ADMIN,
    isSuperAdmin: role === UserRole.SUPER_ADMIN,
    isAdminLike: role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN,
  };
}
/**
 * Custom hook for sign out
 */
export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await nextAuthSignOut({ redirect: false });
    router.push("/auth/login");
  };

  return { signOut: handleSignOut };
}

/**
 * Hook to check if user can access a specific resource
 */
export function useCanAccess(requiredRole?: UserRole | UserRole[]) {
  const { userRole } = useRoleAccess();

  if (!userRole || !requiredRole) {
    return false;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.DRIVER]: 1,
    [UserRole.MANAGER]: 2,
    [UserRole.ADMIN]: 3,
    [UserRole.SUPER_ADMIN]: 4,
  };

  const userHierarchy = roleHierarchy[userRole];
  const maxRequiredHierarchy = Math.max(...roles.map((r) => roleHierarchy[r]));

  return userHierarchy >= maxRequiredHierarchy;
}

/**
 * Hook for redirecting based on role
 */
export function useRequireRole(allowedRoles: UserRole | UserRole[]) {
  const router = useRouter();
  const { session, isLoading } = useAuthSession();
  const { userRole } = useRoleAccess();

  React.useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!userRole || !roles.includes(userRole)) {
      router.push("/dashboard");
    }
  }, [session, isLoading, userRole, allowedRoles, router]);

  return (
    !isLoading &&
    session &&
    userRole &&
    (Array.isArray(allowedRoles)
      ? allowedRoles.includes(userRole)
      : allowedRoles === userRole)
  );
}
