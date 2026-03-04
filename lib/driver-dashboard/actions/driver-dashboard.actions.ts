"use server";

import { auth } from "@/lib/auth";
import { driverDashboardRepository } from "../repositories/driver-dashboard.repository";
import { driverDashboardService } from "./driver-dashboard.service";

/**
 * Driver Dashboard Actions
 * Server actions for UI interactions on driver dashboard
 * All actions verify the user is a driver and operate on their own data only
 */

/**
 * Get driver's dashboard overview
 */
export async function getDriverDashboardOverview() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get driver profile for this user
    const driver = await driverDashboardRepository.getDriverProfileWithStats(
      session.user.id,
    );

    if (!driver) {
      throw new Error("Driver profile not found");
    }

    const overview = await driverDashboardService.getDriverDashboardOverview(
      driver.id,
    );

    return {
      success: true,
      data: overview,
    };
  } catch (error) {
    console.error("[v0] Error fetching driver dashboard overview:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch dashboard",
    };
  }
}

/**
 * Get driver's KPIs
 */
export async function getDriverKPIs() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const driver = await driverDashboardRepository.getDriverProfileWithStats(
      session.user.id,
    );

    if (!driver) {
      throw new Error("Driver profile not found");
    }

    return {
      success: true,
      data: await driverDashboardService.getDriverKPIs(driver.id),
    };
  } catch (error) {
    console.error("[v0] Error fetching driver KPIs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch KPIs",
    };
  }
}

/**
 * Get driver's trips for date
 */
export async function getDriverTripsForDate(date: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const driver = await driverDashboardRepository.getDriverProfileWithStats(
      session.user.id,
    );

    if (!driver) {
      throw new Error("Driver profile not found");
    }

    const parsedDate = new Date(date);
    return {
      success: true,
      data: await driverDashboardService.getTripsForDate(driver.id, parsedDate),
    };
  } catch (error) {
    console.error("[v0] Error fetching driver trips for date:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch trips",
    };
  }
}

/**
 * Get driver's assigned vehicle
 */
export async function getDriverAssignedVehicle() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const driver = await driverDashboardRepository.getDriverProfileWithStats(
      session.user.id,
    );

    if (!driver) {
      throw new Error("Driver profile not found");
    }

    return {
      success: true,
      data: await driverDashboardService.getAssignedVehicle(driver.id),
    };
  } catch (error) {
    console.error("[v0] Error fetching driver assigned vehicle:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch vehicle",
    };
  }
}

/**
 * Get driver's schedule
 */
export async function getDriverSchedule(startDate: string, endDate: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const driver = await driverDashboardRepository.getDriverProfileWithStats(
      session.user.id,
    );

    if (!driver) {
      throw new Error("Driver profile not found");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return {
      success: true,
      data: await driverDashboardService.getSchedule(driver.id, start, end),
    };
  } catch (error) {
    console.error("[v0] Error fetching driver schedule:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch schedule",
    };
  }
}

/**
 * Get driver's upcoming trips
 */
export async function getDriverUpcomingTrips() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const driver = await driverDashboardRepository.getDriverProfileWithStats(
      session.user.id,
    );

    if (!driver) {
      throw new Error("Driver profile not found");
    }

    return {
      success: true,
      data: await driverDashboardService.getUpcomingTrips(driver.id),
    };
  } catch (error) {
    console.error("[v0] Error fetching driver upcoming trips:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch trips",
    };
  }
}

/**
 * Get driver's performance summary
 */
export async function getDriverPerformanceSummary() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const driver = await driverDashboardRepository.getDriverProfileWithStats(
      session.user.id,
    );

    if (!driver) {
      throw new Error("Driver profile not found");
    }

    return {
      success: true,
      data: await driverDashboardService.getPerformanceSummary(driver.id),
    };
  } catch (error) {
    console.error("[v0] Error fetching driver performance summary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch summary",
    };
  }
}
