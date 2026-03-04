"use server";

import { ensureManager } from "@/lib/auth/guards";
import { globalDashboardService } from "./global-dashboard.service";

/**
 * Global Dashboard Actions
 * Server actions for UI interactions on the global dashboard
 * All actions verify manager/admin role access
 */

/**
 * Fetch today's dashboard metrics
 */
export async function getGlobalDashboardMetrics() {
  try {
    // Verify authorization
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      data: await globalDashboardService.getTodayMetrics(),
    };
  } catch (error) {
    console.error("[v0] Error fetching global dashboard metrics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch metrics",
    };
  }
}

/**
 * Fetch KPIs for overview cards
 */
export async function getGlobalDashboardKPIs() {
  try {
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      data: await globalDashboardService.getDashboardKPIs(),
    };
  } catch (error) {
    console.error("[v0] Error fetching global KPIs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch KPIs",
    };
  }
}

/**
 * Fetch trips for a specific date
 */
export async function getGlobalTripsForDate(date: string) {
  try {
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const parsedDate = new Date(date);
    return {
      success: true,
      data: await globalDashboardService.getTripsForDate(parsedDate),
    };
  } catch (error) {
    console.error("[v0] Error fetching global trips for date:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch trips",
    };
  }
}

/**
 * Fetch trips for date range
 */
export async function getGlobalTripsForDateRange(
  startDate: string,
  endDate: string,
) {
  try {
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return {
      success: true,
      data: await globalDashboardService.getTripsForDateRange(start, end),
    };
  } catch (error) {
    console.error("[v0] Error fetching global trips for date range:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch trips",
    };
  }
}

/**
 * Fetch all active drivers
 */
export async function getGlobalActiveDrivers() {
  try {
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      data: await globalDashboardService.getActiveDrivers(),
    };
  } catch (error) {
    console.error("[v0] Error fetching global active drivers:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch drivers",
    };
  }
}

/**
 * Fetch vehicle availability
 */
export async function getGlobalVehicleAvailability() {
  try {
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      data: await globalDashboardService.getVehicleAvailability(),
    };
  } catch (error) {
    console.error("[v0] Error fetching global vehicle availability:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch data",
    };
  }
}

/**
 * Fetch revenue report
 */
export async function getGlobalRevenueReport(
  startDate: string,
  endDate: string,
) {
  try {
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return {
      success: true,
      data: await globalDashboardService.getRevenueReport(start, end),
    };
  } catch (error) {
    console.error("[v0] Error fetching global revenue report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch report",
    };
  }
}

/**
 * Fetch performance metrics
 */
export async function getGlobalPerformanceMetrics() {
  try {
    const session = await ensureManager();
    if (!session) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      data: await globalDashboardService.getPerformanceMetrics(),
    };
  } catch (error) {
    console.error("[v0] Error fetching global performance metrics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch metrics",
    };
  }
}
