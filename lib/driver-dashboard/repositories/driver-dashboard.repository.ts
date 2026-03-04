import { prisma } from "@/lib/db/client";

/**
 * Driver Dashboard Repository
 * Fetches ONLY driver-specific data
 * Always queries by driverId - never returns global data
 */

export const driverDashboardRepository = {
  /**
   * Get driver's trips for a specific date
   */
  async getDriverTripsForDate(driverId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.trip.findMany({
      where: {
        driverId,
        tripDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        vehicle: {
          select: {
            id: true,
            plate: true,
            model: true,
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
   * Get driver's trips for date range
   */
  async getDriverTripsForDateRange(
    driverId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return prisma.trip.findMany({
      where: {
        driverId,
        tripDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        vehicle: true,
        agency: true,
        hotel: true,
      },
      orderBy: { tripDate: "desc" },
    });
  },

  /**
   * Get driver's currently assigned vehicle
   */
  async getDriverAssignedVehicle(driverId: string) {
    const assignment = await prisma.driverVehicleAssignment.findFirst({
      where: {
        driverId,
        isActive: true,
      },
      include: {
        vehicle: {
          include: {
            maintenanceRecords: {
              where: {
                status: "PENDING",
              },
              take: 5,
            },
          },
        },
      },
    });

    return assignment?.vehicle || null;
  },

  /**
   * Get driver's vehicle history
   */
  async getDriverVehicleHistory(driverId: string) {
    return prisma.driverVehicleAssignment.findMany({
      where: {
        driverId,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            plate: true,
            model: true,
          },
        },
      },
      orderBy: { assignedAt: "desc" },
      take: 10,
    });
  },

  /**
   * Get driver's trips schedule (for calendar)
   */
  async getDriverSchedule(
    driverId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return prisma.trip.findMany({
      where: {
        driverId,
        tripDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        tripDate: true,
        departureTime: true,
        estimatedArrivalTime: true,
        destination: true,
        status: true,
        type: true,
      },
      orderBy: { tripDate: "asc" },
    });
  },

  /**
   * Get driver's profile with stats
   */
  async getDriverProfileWithStats(driverId: string) {
    return prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            department: true,
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
    });
  },

  /**
   * Get driver's trip statistics
   */
  async getDriverTripStats(driverId: string) {
    const trips = await prisma.trip.findMany({
      where: { driverId },
      select: {
        status: true,
        tripPrice: true,
        distanceTravelled: true,
        tripDate: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayTrips = trips.filter((t) => {
      const tripDate = new Date(t.tripDate);
      return tripDate >= today && tripDate <= endOfToday;
    });

    return {
      totalTrips: trips.length,
      completedTrips: trips.filter((t) => t.status === "COMPLETED").length,
      todayTrips: todayTrips.length,
      todayCompleted: todayTrips.filter((t) => t.status === "COMPLETED").length,
      totalDistance: trips.reduce((sum, t) => sum + (t.distanceTravelled || 0), 0),
      totalEarnings: trips.reduce((sum, t) => sum + (t.tripPrice || 0), 0),
    };
  },

  /**
   * Get driver's upcoming trips
   */
  async getDriverUpcomingTrips(driverId: string, daysAhead: number = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return prisma.trip.findMany({
      where: {
        driverId,
        tripDate: {
          gte: today,
          lte: futureDate,
        },
        status: {
          in: ["SCHEDULED", "ASSIGNED"],
        },
      },
      include: {
        agency: true,
        hotel: true,
      },
      orderBy: { tripDate: "asc" },
    });
  },

  /**
   * Get driver's completed trips (earnings history)
   */
  async getDriverCompletedTrips(driverId: string, limit: number = 10) {
    return prisma.trip.findMany({
      where: {
        driverId,
        status: "COMPLETED",
      },
      include: {
        agency: {
          select: {
            name: true,
          },
        },
        hotel: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { tripDate: "desc" },
      take: limit,
    });
  },
};
