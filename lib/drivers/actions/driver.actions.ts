"use server";

import { auth } from "@/lib/auth";
import { driverService } from "@/lib/drivers/services/driver.service";
import { DriverStatus } from "@prisma/client";

/**
 * Server Actions for Driver Management
 * All actions are protected by NextAuth session verification
 */

/**
 * Get all drivers visible to the current user
 */
export async function getDrivers() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized: No session");
    }

    const userRole = (session.user as any).role || "DRIVER";
    return await driverService.getDrivers(session.user.id, userRole);
  } catch (error: any) {
    console.error("[Driver Action] Get drivers error:", error);
    throw new Error(error.message || "Failed to fetch drivers");
  }
}

/**
 * Get a single driver by ID
 */
export async function getDriver(driverId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized: No session");
    }

    const userRole = (session.user as any).role || "DRIVER";
    return await driverService.getDriver(driverId, session.user.id, userRole);
  } catch (error: any) {
    console.error("[Driver Action] Get driver error:", error);
    throw new Error(error.message || "Failed to fetch driver");
  }
}

/**
 * Update a driver profile
 */
export async function updateDriver(
  driverId: string,
  data: {
    status?: DriverStatus;
    rating?: number;
    licenseNumber?: string;
    licenseExpiry?: string;
    totalTrips?: number;
    totalKm?: number;
    averageRating?: number;
  },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized: No session");
    }

    const userRole = (session.user as any).role || "DRIVER";
    return await driverService.updateDriver(
      driverId,
      session.user.id,
      userRole,
      data,
    );
  } catch (error: any) {
    console.error("[Driver Action] Update driver error:", error);
    throw new Error(error.message || "Failed to update driver");
  }
}

/**
 * Delete a driver (Admin/Manager only)
 */
export async function deleteDriver(driverId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized: No session");
    }

    const userRole = (session.user as any).role || "DRIVER";
    return await driverService.deleteDriver(driverId, userRole);
  } catch (error: any) {
    console.error("[Driver Action] Delete driver error:", error);
    throw new Error(error.message || "Failed to delete driver");
  }
}

/**
 * Get driver statistics
 */
export async function getDriverStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized: No session");
    }

    const userRole = (session.user as any).role || "DRIVER";

    // Use repository directly for stats
    const { driverRepository } =
      await import("@/lib/drivers/repositories/driver.repository");
    return await driverRepository.getDriverStats(userRole, session.user.id);
  } catch (error: any) {
    console.error("[Driver Action] Get stats error:", error);
    throw new Error(error.message || "Failed to fetch driver statistics");
  }
}

/**
 * Get drivers with expiring licenses
 */
export async function getExpiringLicenses() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized: No session");
    }

    const userRole = (session.user as any).role || "DRIVER";
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot view expiring licenses");
    }

    return await driverService.getExpiringSoonLicenses();
  } catch (error: any) {
    console.error("[Driver Action] Get expiring licenses error:", error);
    throw new Error(error.message || "Failed to fetch expiring licenses");
  }
}
