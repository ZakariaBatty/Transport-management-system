import { prisma } from "@/lib/db/client";
import { Prisma, TripStatus, TripType } from "@prisma/client";

/**
 * Trip Repository
 * Handles all database operations for trips using Prisma ORM
 * Provides role-aware queries that filter data based on user permissions
 */

export const tripRepository = {
  /**
   * Find trips for a user based on their role
   * Drivers only see trips assigned to them
   * Managers/Admins see all trips
   */
  async findTripsForUser(userId: string, userRole: string) {
    const where: Prisma.TripWhereInput = {
      deletedAt: null,
      ...(userRole === "DRIVER" && { driverId: userId }),
    };

    return prisma.trip.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
        vehicle: { select: { id: true, plate: true, model: true } },
        agency: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
        images: true,
      },
      orderBy: { tripDate: "desc" },
    });
  },

  /**
   * Find a single trip by ID with full relations
   */
  async findTripById(tripId: string) {
    return prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        driver: {
          select: {
            id: true,
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        vehicle: { select: { id: true, plate: true, model: true } },
        agency: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
        images: true,
        assignments: {
          include: { assignedByUser: { select: { id: true, name: true } } },
        },
      },
    });
  },

  /**
   * Create a new trip
   */
  async createTrip(data: Prisma.TripCreateInput) {
    return prisma.trip.create({
      data,
      include: {
        driver: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
        vehicle: { select: { id: true, plate: true, model: true } },
        agency: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
      },
    });
  },

  /**
   * Update an existing trip
   */
  async updateTrip(tripId: string, data: Prisma.TripUpdateInput) {
    return prisma.trip.update({
      where: { id: tripId },
      data,
      include: {
        driver: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
        vehicle: { select: { id: true, plate: true, model: true } },
        agency: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
      },
    });
  },

  /**
   * Soft delete a trip by setting deletedAt timestamp
   */
  async deleteTrip(tripId: string) {
    return prisma.trip.update({
      where: { id: tripId },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Get all active agencies
   */
  async getAgencies() {
    return prisma.agency.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Get all active hotels
   */
  async getHotels() {
    return prisma.hotel.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Get all active drivers
   */
  async getDrivers() {
    return prisma.driver.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { user: { name: "asc" } },
    });
  },

  /**
   * Get all active vehicles
   */
  async getVehicles() {
    return prisma.vehicle.findMany({
      where: { deletedAt: null },
      select: { id: true, plate: true, model: true, status: true },
      orderBy: { plate: "asc" },
    });
  },

  /**
   * Get trip statistics for dashboard
   */
  async getTripStats(userRole: string, userId?: string) {
    const where: Prisma.TripWhereInput = {
      deletedAt: null,
      ...(userRole === "DRIVER" && userId && { driverId: userId }),
    };

    const [totalTrips, completedTrips, inProgressTrips, scheduledTrips] =
      await Promise.all([
        prisma.trip.count({ where }),
        prisma.trip.count({ where: { ...where, status: "COMPLETED" } }),
        prisma.trip.count({ where: { ...where, status: "IN_PROGRESS" } }),
        prisma.trip.count({ where: { ...where, status: "SCHEDULED" } }),
      ]);

    return {
      totalTrips,
      completedTrips,
      inProgressTrips,
      scheduledTrips,
    };
  },

  /**
   * Get total passengers for a user's trips
   */
  async getTotalPassengers(userRole: string, userId?: string) {
    const where: Prisma.TripWhereInput = {
      deletedAt: null,
      ...(userRole === "DRIVER" && userId && { driverId: userId }),
    };

    const result = await prisma.trip.aggregate({
      where,
      _sum: { passengersCount: true },
    });

    return result._sum.passengersCount ?? 0;
  },
};
