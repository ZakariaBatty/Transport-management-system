import { UserRole } from "@prisma/client";
import bcryptjs from "bcryptjs";

/**
 * Hash a password using bcryptjs
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // NIST recommends minimum 10 rounds
  return bcryptjs.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password to check
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match, false otherwise
 */
export async function comparePasswords(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns true if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Must be at least 8 characters, contain uppercase, lowercase, number, and symbol
 * @param password - Password to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character (!@#$%^&*)",
    };
  }

  return { isValid: true };
}

// ───────────────────────────────────────────────────────────────────────
// ROLE-BASED PERMISSION HELPERS
// ───────────────────────────────────────────────────────────────────────

/**
 * Check if a role has admin-level access
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

/**
 * Check if a role is super admin
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN;
}

/**
 * Check if a role is manager
 */
export function isManager(role: UserRole): boolean {
  return role === UserRole.MANAGER;
}

/**
 * Check if a role is driver
 */
export function isDriver(role: UserRole): boolean {
  return role === UserRole.DRIVER;
}

/**
 * Get role hierarchy level (higher = more permissions)
 * SUPER_ADMIN: 4, ADMIN: 3, MANAGER: 2, DRIVER: 1
 */
export function getRoleHierarchy(role: UserRole): number {
  const hierarchy: Record<UserRole, number> = {
    [UserRole.SUPER_ADMIN]: 4,
    [UserRole.ADMIN]: 3,
    [UserRole.MANAGER]: 2,
    [UserRole.DRIVER]: 1,
  };
  return hierarchy[role];
}

/**
 * Check if a role can access a specific resource
 */
export function canAccessResource(
  userRole: UserRole,
  requiredRole: UserRole | UserRole[],
): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const userHierarchy = getRoleHierarchy(userRole);
  const maxRequiredHierarchy = Math.max(...roles.map(getRoleHierarchy));

  return userHierarchy >= maxRequiredHierarchy;
}

/**
 * Check if user can perform administrative actions
 */
export function canPerformAdminAction(role: UserRole): boolean {
  return isAdmin(role);
}

/**
 * Check if user can view all data (admin roles)
 */
export function canViewAllData(role: UserRole): boolean {
  return isAdmin(role);
}

/**
 * Check if user can see operational data
 */
export function canViewOperationalData(role: UserRole): boolean {
  return isAdmin(role) || isManager(role);
}

/**
 * Check if user is restricted to own data (drivers)
 */
export function isDataRestricted(role: UserRole): boolean {
  return isDriver(role);
}

// ───────────────────────────────────────────────────────────────────────
// PAGE ACCESS HELPERS
// ───────────────────────────────────────────────────────────────────────

/**
 * Check if role can access dashboard
 */
export function canAccessDashboard(role: UserRole): boolean {
  // All roles can access dashboard, but content differs
  return true;
}

/**
 * Check if role can access trips page
 */
export function canAccessTrips(role: UserRole): boolean {
  // All roles can access trips (drivers see own, managers/admins see all)
  return true;
}

/**
 * Check if role can access drivers page
 */
export function canAccessDrivers(role: UserRole): boolean {
  return !isDriver(role); // Drivers cannot access drivers page
}

/**
 * Check if role can access vehicles page
 */
export function canAccessVehicles(role: UserRole): boolean {
  return !isDriver(role); // Drivers cannot access vehicles page
}

/**
 * Check if role can access maintenance page
 */
export function canAccessMaintenance(role: UserRole): boolean {
  return isAdmin(role) || isManager(role);
}

/**
 * Check if role can access reports page
 */
export function canAccessReports(role: UserRole): boolean {
  return isAdmin(role) || isManager(role);
}

/**
 * Check if role can access users/settings page
 */
export function canAccessSettings(role: UserRole): boolean {
  return isAdmin(role);
}

/**
 * Get accessible routes for a role
 */
export function getAccessibleRoutes(role: UserRole): string[] {
  const routes = ["/dashboard"];

  if (canAccessTrips(role)) routes.push("/trips");
  if (canAccessDrivers(role)) routes.push("/drivers");
  if (canAccessVehicles(role)) routes.push("/vehicles");
  if (canAccessMaintenance(role)) routes.push("/maintenance");
  if (canAccessReports(role)) routes.push("/reports");
  if (canAccessSettings(role)) routes.push("/settings");

  routes.push("/profile"); // All users can access profile

  return routes;
}
