"use server";

import { auth } from "@/lib/auth";
import { userService } from "@/lib/users/services/user.service";
import { UserRole, UserStatus } from "@prisma/client";

// Check if user has permission to manage users
async function checkManagePermission() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    throw new Error("Insufficient permissions");
  }

  return session.user.id;
}

export async function fetchUsers() {
  try {
    await checkManagePermission();
    return await userService.getAllUsers();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch users",
    );
  }
}

export async function fetchUserStatistics() {
  try {
    await checkManagePermission();
    return await userService.getStatistics();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch statistics",
    );
  }
}

export async function createUserAction(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  department?: string;
  avatar?: string;
}) {
  try {
    await checkManagePermission();
    return await userService.createUser(data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create user",
    );
  }
}

export async function updateUserAction(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    status?: UserStatus;
    department?: string;
    avatar?: string;
  },
) {
  try {
    await checkManagePermission();
    return await userService.updateUser(id, data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update user",
    );
  }
}

export async function deleteUserAction(id: string) {
  try {
    await checkManagePermission();
    return await userService.deleteUser(id);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete user",
    );
  }
}
