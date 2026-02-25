"use server";

import {
  authenticationService,
  rolePermissionService,
} from "../services/auth.service";
import { userRepository } from "../repositories/user.repository";
import { UserRole } from "@prisma/client";

/**
 * Server Actions for Authentication
 * These actions bridge the gap between client forms and the authentication service
 * All logic is delegated to services
 */

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  role?: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function registerUserAction(
  formData: RegisterFormData,
): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    const result = await authenticationService.registerUser({
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      name: formData.name,
      phone: formData.phone,
      role: formData.role || UserRole.DRIVER,
    });

    return {
      success: result.success,
      message: result.message,
      userId: result.userId,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function loginAction(formData: LoginFormData): Promise<{
  success: boolean;
  message: string;
  user?: {
    userId: string;
    email: string;
    role: UserRole;
    name: string;
    phone: string;
  };
}> {
  try {
    const user = await authenticationService.authenticateUser(
      formData.email,
      formData.password,
    );

    return {
      success: true,
      message: "Login successful",
      user,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function changePasswordAction(
  userId: string,
  formData: ChangePasswordFormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await authenticationService.changePassword(
      userId,
      formData.currentPassword,
      formData.newPassword,
      formData.confirmPassword,
    );

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Password change failed",
    };
  }
}

export async function resetPasswordAction(
  userId: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await authenticationService.resetPassword(
      userId,
      newPassword,
    );
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Password reset failed",
    };
  }
}

export async function getUserByIdAction(userId: string): Promise<{
  success: boolean;
  user?: any;
  message?: string;
}> {
  try {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}

export async function checkEmailAvailabilityAction(
  email: string,
): Promise<{ available: boolean }> {
  try {
    const exists = await userRepository.emailExists(email);
    return { available: !exists };
  } catch {
    return { available: false };
  }
}

export async function validateUserAccessAction(
  userId: string,
  requiredRole: UserRole | UserRole[],
): Promise<{ hasAccess: boolean; role?: UserRole }> {
  try {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      return { hasAccess: false };
    }

    const hasAccess = rolePermissionService.checkResourceAccess(
      user.role,
      requiredRole,
    );

    return {
      hasAccess,
      role: user.role,
    };
  } catch {
    return { hasAccess: false };
  }
}

export async function canViewUserDataAction(
  requestingUserId: string,
  targetUserId: string,
): Promise<{ canView: boolean; reason?: string }> {
  try {
    const requestingUser = await userRepository.findUserById(requestingUserId);
    if (!requestingUser) {
      return { canView: false, reason: "Requesting user not found" };
    }

    const canView = rolePermissionService.canViewUserData(
      requestingUser.role,
      targetUserId,
      requestingUserId,
    );

    return {
      canView,
      reason: !canView ? "Insufficient permissions" : undefined,
    };
  } catch (error) {
    return {
      canView: false,
      reason:
        error instanceof Error ? error.message : "Permission check failed",
    };
  }
}

export async function getUserRoleDisplayNameAction(
  role: UserRole,
): Promise<string> {
  return rolePermissionService.getRoleDisplayName(role);
}
