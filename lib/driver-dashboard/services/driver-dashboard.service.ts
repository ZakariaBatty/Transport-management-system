import { driverDashboardRepository } from "../repositories/driver-dashboard.repository";

/**
 * Driver Dashboard Service
 * Computes statistics specific to a driver
 * All methods require driverId parameter - never queries global data
 */

export const driverDashboardService = {
  /**
   * Get driver's dashboard overview (main cards)
   */
  async getDriverDashboardOverview(driverId: string) {
    const [tripStats, profile, upcomingTrips] = await Promise.all([
      driverDashboardRepository.getDriverTripStats(driverId),
      driverDashboardRepository.getDriverProfileWithStats(driverId),
      driverDashboardRepository.getDriverUpcomingTrips(driverId, 7),
    ]);

    return {
      profile,
      stats: tripStats,
      upcomingTrips,
      timestamp: new Date(),
    };
  },

  /**
   * Get driver's KPIs for cards
   */
  async getDriverKPIs(driverId: string) {
    const stats = await driverDashboardRepository.getDriverTripStats(driverId);
    const profile = await driverDashboardRepository.getDriverProfileWithStats(
      driverId,
    );
    const vehicle = await driverDashboardRepository.getDriverAssignedVehicle(
      driverId,
    );

    return {
      // Driver info
      driverName: profile?.user.name,
      driverRating: profile?.rating || 0,
      averageRating: profile?.averageRating || 0,

      // Trip KPIs
      totalTripsCompleted: stats.completedTrips,
      totalTrips: stats.totalTrips,
      todayTripsCompleted: stats.todayCompleted,
      todayTrips: stats.todayTrips,

      // Distance & Earnings
      totalDistance: stats.totalDistance,
      totalEarnings: stats.totalEarnings,

      // Vehicle
      assignedVehicle: vehicle ? `${vehicle.plate} (${vehicle.model})` : "No vehicle assigned",
    };
  },

  /**
   * Get driver's trips for date
   */
  async getTripsForDate(driverId: string, date: Date) {
    return driverDashboardRepository.getDriverTripsForDate(driverId, date);
  },

  /**
   * Get driver's trips for date range
   */
  async getTripsForDateRange(
    driverId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return driverDashboardRepository.getDriverTripsForDateRange(
      driverId,
      startDate,
      endDate,
    );
  },

  /**
   * Get driver's assigned vehicle
   */
  async getAssignedVehicle(driverId: string) {
    return driverDashboardRepository.getDriverAssignedVehicle(driverId);
  },

  /**
   * Get driver's vehicle history
   */
  async getVehicleHistory(driverId: string) {
    return driverDashboardRepository.getDriverVehicleHistory(driverId);
  },

  /**
   * Get driver's calendar (schedule)
   */
  async getSchedule(driverId: string, startDate: Date, endDate: Date) {
    return driverDashboardRepository.getDriverSchedule(driverId, startDate, endDate);
  },

  /**
   * Get driver's upcoming trips
   */
  async getUpcomingTrips(driverId: string) {
    return driverDashboardRepository.getDriverUpcomingTrips(driverId, 7);
  },

  /**
   * Get driver's completed trips
   */
  async getCompletedTrips(driverId: string) {
    return driverDashboardRepository.getDriverCompletedTrips(driverId, 10);
  },

  /**
   * Get driver's performance summary
   */
  async getPerformanceSummary(driverId: string) {
    const stats = await driverDashboardRepository.getDriverTripStats(driverId);
    const profile = await driverDashboardRepository.getDriverProfileWithStats(
      driverId,
    );

    const completionRate =
      stats.totalTrips > 0
        ? (stats.completedTrips / stats.totalTrips) * 100
        : 0;
    const averageEarningsPerTrip =
      stats.completedTrips > 0
        ? stats.totalEarnings / stats.completedTrips
        : 0;
    const averageDistancePerTrip =
      stats.totalTrips > 0
        ? stats.totalDistance / stats.totalTrips
        : 0;

    return {
      completionRate: Math.round(completionRate),
      rating: profile?.rating || 0,
      averageRating: profile?.averageRating || 0,
      totalEarnings: stats.totalEarnings,
      totalDistance: Math.round(stats.totalDistance),
      averageEarningsPerTrip: Math.round(averageEarningsPerTrip * 100) / 100,
      averageDistancePerTrip: Math.round(averageDistancePerTrip),
    };
  },

  /**
   * Get driver's earnings summary for period
   */
  async getEarningsSummary(driverId: string, startDate: Date, endDate: Date) {
    const trips = await driverDashboardRepository.getDriverTripsForDateRange(
      driverId,
      startDate,
      endDate,
    );

    const completedTrips = trips.filter((t) => t.status === "COMPLETED");
    const totalEarnings = completedTrips.reduce(
      (sum, t) => sum + (t.tripPrice || 0),
      0,
    );

    return {
      period: {
        start: startDate,
        end: endDate,
      },
      totalTrips: trips.length,
      completedTrips: completedTrips.length,
      totalEarnings,
      averageEarningsPerTrip:
        completedTrips.length > 0
          ? totalEarnings / completedTrips.length
          : 0,
    };
  },
};
