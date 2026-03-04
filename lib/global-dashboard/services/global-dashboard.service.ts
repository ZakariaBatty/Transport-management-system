import { globalDashboardRepository } from "../repositories/global-dashboard.repository";

/**
 * Global Dashboard Service
 * Computes KPIs and aggregations for the entire system
 * All calculations are done on global data with NO role filtering
 */

export const globalDashboardService = {
  /**
   * Get today's dashboard metrics (main dashboard card)
   */
  async getTodayMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [tripStats, vehicleStats, driverStats, userStats] = await Promise.all(
      [
        globalDashboardRepository.getTripStatsForDate(today),
        globalDashboardRepository.getVehicleStats(),
        globalDashboardRepository.getDriverCountByStatus(),
        globalDashboardRepository.getUserCountByRole(),
      ],
    );

    return {
      trips: tripStats,
      vehicles: vehicleStats,
      drivers: driverStats,
      users: userStats,
      timestamp: new Date(),
    };
  },

  /**
   * Get dashboard KPIs for overview cards
   */
  async getDashboardKPIs() {
    const summary = await globalDashboardRepository.getGlobalStatsSummary();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStats = await globalDashboardRepository.getTripStatsForDate(today);

    return {
      // User KPIs
      totalUsers: summary.totalUsers,

      // Driver KPIs
      totalActiveDrivers: summary.totalDrivers,

      // Vehicle KPIs
      totalVehicles: summary.totalVehicles,
      availableVehicles: summary.totalVehicles, // Simplified - get from repo

      // Trip KPIs
      activeTrips: summary.activeTrips,
      totalTripsCompleted: todayStats.completedTrips,
      totalTripsToday: todayStats.totalTrips,

      // Revenue KPIs
      todayRevenue: todayStats.totalRevenue,
      averageTripPrice: todayStats.averagePrice,

      // Distance KPIs
      totalDistanceToday: todayStats.totalDistance,
    };
  },

  /**
   * Get all trips for date with details
   */
  async getTripsForDate(date: Date) {
    return globalDashboardRepository.getAllTripsForDate(date);
  },

  /**
   * Get trips for date range
   */
  async getTripsForDateRange(startDate: Date, endDate: Date) {
    return globalDashboardRepository.getAllTripsForDateRange(startDate, endDate);
  },

  /**
   * Get all active drivers
   */
  async getActiveDrivers() {
    return globalDashboardRepository.getAllActiveDrivers();
  },

  /**
   * Get all vehicles
   */
  async getVehiclesInUse() {
    return globalDashboardRepository.getAllVehiclesInUse();
  },

  /**
   * Get vehicle availability statistics
   */
  async getVehicleAvailability() {
    return globalDashboardRepository.getVehicleStats();
  },

  /**
   * Get driver availability by status
   */
  async getDriverAvailability() {
    const statusCounts = await globalDashboardRepository.getDriverCountByStatus();
    return statusCounts.reduce(
      (acc, { status, _count }) => {
        acc[status] = _count;
        return acc;
      },
      {} as Record<string, number>,
    );
  },

  /**
   * Get revenue report for date range
   */
  async getRevenueReport(startDate: Date, endDate: Date) {
    const trips = await globalDashboardRepository.getAllTripsForDateRange(
      startDate,
      endDate,
    );

    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.tripPrice || 0), 0);
    const totalCost = trips.reduce((sum, trip) => sum + (trip.actualCost || 0), 0);
    const profit = totalRevenue - totalCost;

    return {
      totalRevenue,
      totalCost,
      profit,
      profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0,
      tripCount: trips.length,
      averageRevenuePerTrip: trips.length > 0 ? totalRevenue / trips.length : 0,
    };
  },

  /**
   * Get distance report
   */
  async getDistanceReport(startDate: Date, endDate: Date) {
    const trips = await globalDashboardRepository.getAllTripsForDateRange(
      startDate,
      endDate,
    );

    const totalDistance = trips.reduce(
      (sum, trip) => sum + (trip.distanceTravelled || 0),
      0,
    );
    const averageDistance =
      trips.length > 0 ? totalDistance / trips.length : 0;

    return {
      totalDistance,
      averageDistance,
      tripCount: trips.length,
      totalTripsCompleted: trips.filter((t) => t.status === "COMPLETED").length,
    };
  },

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = await globalDashboardRepository.getTripStatsForDate(today);
    const drivers = await globalDashboardRepository.getAllActiveDrivers();

    const topPerformers = drivers
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return {
      todayTripsCompleted: todayStats.completedTrips,
      todayTotalTrips: todayStats.totalTrips,
      completionRate:
        todayStats.totalTrips > 0
          ? (todayStats.completedTrips / todayStats.totalTrips) * 100
          : 0,
      topPerformers,
    };
  },
};
