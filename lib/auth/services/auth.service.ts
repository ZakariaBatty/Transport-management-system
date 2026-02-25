import { userRepository } from "../repositories/user.repository";
import {
  hashPassword,
  comparePasswords,
  isValidEmail,
  validatePassword,
  canAccessResource,
  isDataRestricted,
} from "../helpers";

/**
 * Authentication Service
 * Contains all business logic for authentication
 * Uses userRepository for database access
 * Follows SOLID principles - no direct database calls
 */

export class AuthenticationService {
  /**
   * Register a new user
   * @throws Error if email already exists, invalid email, or weak password
   */
  async registerUser(data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    role: 'driver' | 'manager' | 'admin' | 'super_admin';
  }): Promise<{ success: boolean; userId: string; message: string }> {
    // Validate email
    if (!isValidEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    // Validate email uniqueness
    const existingUser = await userRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await userRepository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: data.role,
    });

    return {
      success: true,
      userId: user.id,
      message: "User registered successfully",
    };
  }

  /**
   * Authenticate user with email and password
   * @returns User object if authentication successful, throws error otherwise
   */
  async authenticateUser(
    email: string,
    password: string,
  ): Promise<{
    userId: string;
    email: string;
    role: 'driver' | 'manager' | 'admin' | 'super_admin';
    name: string;
    phone: string;
  }> {
    // Validate email format
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Find user by email
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.password || '');
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Check if user is active
    if (user.status !== "active") {
      throw new Error("User account is inactive or suspended");
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    };
  }

  /**
   * Validate user credentials without throwing errors
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      await this.authenticateUser(email, password);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    // Get user
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePasswords(
      currentPassword,
      user.password || '',
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
      throw new Error("New passwords do not match");
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await userRepository.updateUserPassword(userId, hashedPassword);

    return {
      success: true,
      message: "Password changed successfully",
    };
  }

  /**
   * Reset password (admin action)
   */
  async resetPassword(
    userId: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    // Validate user exists
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await userRepository.updateUserPassword(userId, hashedPassword);

    return {
      success: true,
      message: "Password reset successfully",
    };
  }
}

/**
 * Role & Permission Service
 * Handles role-based access control logic
 */
export class RolePermissionService {
  /**
   * Check if user has permission to access a resource
   */
  checkResourceAccess(
    userRole: 'driver' | 'manager' | 'admin' | 'super_admin',
    requiredRole: ('driver' | 'manager' | 'admin' | 'super_admin') | ('driver' | 'manager' | 'admin' | 'super_admin')[],
  ): boolean {
    return canAccessResource(userRole, requiredRole);
  }

  /**
   * Check if user is restricted to their own data
   */
  isUserDataRestricted(userRole: 'driver' | 'manager' | 'admin' | 'super_admin'): boolean {
    return isDataRestricted(userRole);
  }

  /**
   * Check if user can view another user's data
   */
  canViewUserData(
    requestingUserRole: 'driver' | 'manager' | 'admin' | 'super_admin',
    targetUserId: string,
    requestingUserId: string,
  ): boolean {
    // Admins can view all users
    if (
      requestingUserRole === 'admin' ||
      requestingUserRole === 'super_admin'
    ) {
      return true;
    }

    // Managers can view all users
    if (requestingUserRole === 'manager') {
      return true;
    }

    // Drivers can only view their own data
    if (requestingUserRole === 'driver') {
      return requestingUserId === targetUserId;
    }

    return false;
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role: 'driver' | 'manager' | 'admin' | 'super_admin'): string {
    const displayNames: Record<'driver' | 'manager' | 'admin' | 'super_admin', string> = {
      'driver': "Driver",
      'manager': "Manager",
      'admin': "Administrator",
      'super_admin': "Super Administrator",
    };
    return displayNames[role];
  }

  /**
   * Get all available roles (useful for dropdowns)
   */
  getAvailableRoles(currentUserRole: 'driver' | 'manager' | 'admin' | 'super_admin'): ('driver' | 'manager' | 'admin' | 'super_admin')[] {
    // Super admin can assign any role
    if (currentUserRole === 'super_admin') {
      return ['driver', 'manager', 'admin'];
    }

    // Admin can assign driver and manager roles
    if (currentUserRole === 'admin') {
      return ['driver', 'manager'];
    }

    // Other roles cannot assign roles
    return [];
  }
}

// Export singleton instances
export const authenticationService = new AuthenticationService();
export const rolePermissionService = new RolePermissionService();
