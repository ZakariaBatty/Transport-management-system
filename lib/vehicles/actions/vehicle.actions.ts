"use server";

import { auth } from "@/lib/auth";
import { vehicleService } from "@/lib/vehicles/services/vehicle.service";
import { vehicleRepository } from "@/lib/vehicles/repositories/vehicle.repository";

/**
 * Server Actions for Vehicles
 * All actions are protected by NextAuth and role-based authorization
 * Returns type-safe responses with errors
 */

export async function getVehiclesAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";
    const vehicles = await vehicleService.getVehicles(
      session.user.id,
      userRole,
    );

    return { success: true, data: vehicles };
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch vehicles",
    };
  }
}

export async function getVehicleStatsAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";
    const stats = await vehicleRepository.getVehicleStats(
      userRole,
      session.user.id,
    );

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching vehicle stats:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch statistics",
    };
  }
}

export async function createVehicleAction(data: {
  model: string;
  plate: string;
  vin: string;
  registrationExpiry: Date;
  capacity: number;
  monthlyRent: number;
  salik?: number;
  owner?: string;
  kmUsage?: number;
}) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";

    const vehicle = await vehicleService.createVehicle(userRole, {
      model: data.model,
      plate: data.plate,
      vin: data.vin,
      registrationExpiry: data.registrationExpiry,
      capacity: data.capacity,
      monthlyRent: data.monthlyRent,
      salik: data.salik,
      owner: data.owner,
      kmUsage: data.kmUsage,
    });

    return { success: true, data: vehicle };
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create vehicle",
    };
  }
}

export async function updateVehicleAction(
  vehicleId: string,
  data: {
    model?: string;
    plate?: string;
    vin?: string;
    registrationExpiry?: Date;
    capacity?: number;
    monthlyRent?: number;
    salik?: number;
    owner?: string;
    kmUsage?: number;
    status?: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
    lastMaintenance?: Date;
    nextMaintenanceDate?: Date;
  },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";

    const vehicle = await vehicleService.updateVehicle(vehicleId, userRole, {
      model: data.model,
      plate: data.plate,
      vin: data.vin,
      registrationExpiry: data.registrationExpiry,
      capacity: data.capacity,
      monthlyRent: data.monthlyRent,
      salik: data.salik,
      owner: data.owner,
      kmUsage: data.kmUsage,
      status: data.status as any,
      lastMaintenance: data.lastMaintenance,
      nextMaintenanceDate: data.nextMaintenanceDate,
    });

    return { success: true, data: vehicle };
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update vehicle",
    };
  }
}

export async function deleteVehicleAction(vehicleId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";

    // Only managers/admins can delete
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return { success: false, error: "Unauthorized: Cannot delete vehicles" };
    }

    await vehicleRepository.deleteVehicle(vehicleId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete vehicle",
    };
  }
}

export async function assignDriverAction(vehicleId: string, driverId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";

    // Only managers/admins can assign
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return { success: false, error: "Unauthorized: Cannot assign drivers" };
    }

    const assignment = await vehicleRepository.assignDriverToVehicle(
      vehicleId,
      driverId,
    );

    return { success: true, data: assignment };
  } catch (error) {
    console.error("Error assigning driver:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to assign driver",
    };
  }
}

export async function unassignDriverAction(vehicleId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";

    // Only managers/admins can unassign
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return { success: false, error: "Unauthorized: Cannot unassign drivers" };
    }

    await vehicleRepository.unassignDriver(vehicleId);

    return { success: true };
  } catch (error) {
    console.error("Error unassigning driver:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to unassign driver",
    };
  }
}

export async function getAvailableDriversAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = (session.user as any).role || "driver";

    // Only managers/admins can view drivers
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return { success: false, error: "Unauthorized" };
    }

    const drivers = await vehicleRepository.getAvailableDrivers();

    return { success: true, data: drivers };
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch drivers",
    };
  }
}
