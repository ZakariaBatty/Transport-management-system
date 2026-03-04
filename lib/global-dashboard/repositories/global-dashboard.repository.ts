import { prisma } from "@/lib/db/client";

/**
 * Global Dashboard Repository
 * Fetches ALL data for aggregation and reporting
 * No filtering - returns global view of the entire system
 */

export const globalDashboardRepository = {
  /**
   * Get all trips for a specific date (no filtering)
   */
  async getAllTripsForDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.trip.findMany({
      where: {
        tripDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        vehicle: {
          select: {
            id: true,
            plate: true,
            model: true,
            capacity: true,
            status: true,
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: { tripDate: "desc" },
    });
  },

  /**
   * Get all trips within a date range
   */
  async getAllTripsForDateRange(startDate: Date, endDate: Date) {
    return prisma.trip.findMany({
      where: {
        tripDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        vehicle: true,
        agency: true,
        hotel: true,
      },
      orderBy: { tripDate: "desc" },
    });
  },

  /**
   * Get all trips with aggregation data
   */
  async getAllTripsWithStats() {
    return prisma.trip.findMany({
      include: {
        driver: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        vehicle: {
          select: {
            plate: true,
          },
        },
        agency: true,
      },
      orderBy: { tripDate: "desc" },
      take: 100, // Limit for performance
    });
  },

  /**
   * Get all active drivers
   */
  async getAllActiveDrivers() {
    return prisma.driver.findMany({
      where: {
        status: "AVAILABLE",
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        vehicleAssignments: {
          where: { isActive: true },
          include: {
            vehicle: {
              select: {
                id: true,
                plate: true,
                model: true,
              },
            },
          },
        },
      },
      orderBy: { rating: "desc" },
    });
  },

  /**
   * Get count of all drivers by status
   */
  async getDriverCountByStatus() {
    return prisma.driver.groupBy({
      by: ["status"],
      _count: true,
      where: {
        deletedAt: null,
      },
    });
  },

  /**
   * Get all vehicles in use today
   */
  async getAllVehiclesInUse() {
    return prisma.vehicle.findMany({
      where: {
        status: "IN_USE",
        deletedAt: null,
      },
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            driver: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { plate: "asc" },
    });
  },

  /**
   * Get vehicle statistics
   */
  async getVehicleStats() {
    const [total, available, inUse, maintenance] = await Promise.all([
      prisma.vehicle.count({ where: { deletedAt: null } }),
      prisma.vehicle.count({ where: { status: "AVAILABLE", deletedAt: null } }),
      prisma.vehicle.count({ where: { status: "IN_USE", deletedAt: null } }),
      prisma.vehicle.count({
        where: { status: "MAINTENANCE", deletedAt: null },
      }),
    ]);

    return { total, available, inUse, maintenance };
  },

  /**
   * Get trip statistics for date
   */
  async getTripStatsForDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const trips = await prisma.trip.findMany({
      where: {
        tripDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        status: true,
        tripPrice: true,
        distanceTravelled: true,
      },
    });

    const totalTrips = trips.length;
    const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;
    const totalRevenue = trips.reduce((sum, t) => sum + (t.tripPrice || 0), 0);
    const totalDistance = trips.reduce(
      (sum, t) => sum + (t.distanceTravelled || 0),
      0,
    );

    return {
      totalTrips,
      completedTrips,
      totalRevenue,
      totalDistance,
      averagePrice:
        totalTrips > 0
          ? trips.reduce((sum, t) => sum + (t.tripPrice || 0), 0) / totalTrips
          : 0,
    };
  },

  /**
   * Get all users by role (for global overview)
   */
  async getUserCountByRole() {
    return prisma.user.groupBy({
      by: ["role"],
      _count: true,
      where: {
        status: "ACTIVE",
      },
    });
  },

  /**
   * Get global statistics summary
   */
  async getGlobalStatsSummary() {
    const [
      totalUsers,
      totalDrivers,
      totalVehicles,
      activeTripsCount,
      totalTripsCount,
    ] = await Promise.all([
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.driver.count({ where: { status: "AVAILABLE", deletedAt: null } }),
      prisma.vehicle.count({ where: { deletedAt: null } }),
      prisma.trip.count({
        where: { status: "IN_PROGRESS" },
      }),
      prisma.trip.count(),
    ]);

    return {
      totalUsers,
      totalDrivers,
      totalVehicles,
      activeTrips: activeTripsCount,
      totalTrips: totalTripsCount,
    };
  },
};
