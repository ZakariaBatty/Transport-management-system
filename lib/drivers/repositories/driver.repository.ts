import { prisma } from "@/lib/db/client";
import { Prisma, DriverStatus } from "@prisma/client";

/**
 * Driver Repository
 * Handles all database operations for drivers using Prisma ORM
 * Provides role-aware queries that filter data based on user permissions
 */

export const driverRepository = {
  /**
   * Find drivers for a user based on their role
   * Managers/Admins see all drivers
   * Drivers can only see their own profile
   */
  async findDriversForUser(userId: string, userRole: string) {
    const where: Prisma.DriverWhereInput = {
      deletedAt: null,
      ...(userRole === "DRIVER" && { userId }),
    };

    return prisma.driver.findMany({
      where,
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
              select: { id: true, plate: true, model: true, capacity: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Find a single driver by ID with full relations
   */
  async findDriverById(driverId: string) {
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
                capacity: true,
                status: true,
              },
            },
          },
        },
      },
    });
  },

  /**
   * Find a driver by userId
   */
  async findDriverByUserId(userId: string) {
    return prisma.driver.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  },

  /**
   * Create a new driver profile
   */
  async createDriver(data: Prisma.DriverCreateInput) {
    return prisma.driver.create({
      data,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  },

  /**
   * Update an existing driver
   */
  async updateDriver(driverId: string, data: Prisma.DriverUpdateInput) {
    return prisma.driver.update({
      where: { id: driverId },
      data,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        vehicleAssignments: {
          where: { isActive: true },
          include: {
            vehicle: { select: { id: true, plate: true, model: true } },
          },
        },
      },
    });
  },

  /**
   * Soft delete a driver by setting deletedAt timestamp
   */
  async deleteDriver(driverId: string) {
    return prisma.driver.update({
      where: { id: driverId },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Check if license number is unique
   */
  async isLicenseNumberUnique(
    licenseNumber: string,
    excludeId?: string,
  ): Promise<boolean> {
    const existing = await prisma.driver.findFirst({
      where: {
        licenseNumber,
        ...(excludeId && { NOT: { id: excludeId } }),
        deletedAt: null,
      },
    });
    return !existing;
  },

  /**
   * Get driver statistics
   */
  async getDriverStats(userRole: string, userId?: string) {
    let where: Prisma.DriverWhereInput = { deletedAt: null };

    if (userRole === "DRIVER" && userId) {
      where = { ...where, userId };
    }

    const [totalDrivers, availableDrivers, onTripDrivers, offDutyDrivers] =
      await Promise.all([
        prisma.driver.count({ where }),
        prisma.driver.count({ where: { ...where, status: "AVAILABLE" } }),
        prisma.driver.count({ where: { ...where, status: "ON_TRIP" } }),
        prisma.driver.count({ where: { ...where, status: "OFF_DUTY" } }),
      ]);

    return {
      totalDrivers,
      availableDrivers,
      onTripDrivers,
      offDutyDrivers,
    };
  },

  /**
   * Get all active drivers for dropdowns
   */
  async getActiveDrivers() {
    return prisma.driver.findMany({
      where: { deletedAt: null, status: "AVAILABLE" },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get drivers with high ratings
   */
  async getTopRatedDrivers(limit: number = 5) {
    return prisma.driver.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { averageRating: "desc" },
      take: limit,
    });
  },

  /**
   * Get drivers expiring licenses soon (within 30 days)
   */
  async getExpiringSoonLicenses() {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return prisma.driver.findMany({
      where: {
        deletedAt: null,
        licenseExpiry: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { licenseExpiry: "asc" },
    });
  },
};
