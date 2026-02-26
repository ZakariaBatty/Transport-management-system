import { prisma } from "@/lib/db/client";
import { Prisma } from "@prisma/client";

/**
 * Vehicle Repository
 * Handles all database operations for vehicles using Prisma ORM
 * Provides role-aware queries that filter data based on user permissions
 */

export const vehicleRepository = {
  /**
   * Find vehicles for a user based on their role
   * Drivers only see vehicles assigned to them
   * Managers/Admins see all vehicles
   */
  async findVehiclesForUser(userId: string, userRole: string) {
    const where: Prisma.VehicleWhereInput = {
      deletedAt: null,
      ...(userRole === "driver" && {
        assignments: {
          some: {
            driverId: userId,
            isActive: true,
          },
        },
      }),
    };

    return prisma.vehicle.findMany({
      where,
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            driver: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
        maintenance: {
          where: { deletedAt: null },
          orderBy: { scheduledDate: "desc" },
          take: 3,
        },
      },
      orderBy: { plate: "asc" },
    });
  },

  /**
   * Find a single vehicle by ID with full relations
   */
  async findVehicleById(vehicleId: string) {
    return prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            driver: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, phone: true },
                },
              },
            },
          },
          orderBy: { assignedAt: "desc" },
        },
        maintenance: {
          where: { deletedAt: null },
          orderBy: { scheduledDate: "desc" },
        },
      },
    });
  },

  /**
   * Create a new vehicle
   */
  async createVehicle(data: Prisma.VehicleCreateInput) {
    return prisma.vehicle.create({
      data,
      include: {
        assignments: {
          include: {
            driver: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });
  },

  /**
   * Update an existing vehicle
   */
  async updateVehicle(vehicleId: string, data: Prisma.VehicleUpdateInput) {
    return prisma.vehicle.update({
      where: { id: vehicleId },
      data,
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            driver: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });
  },

  /**
   * Soft delete a vehicle by setting deletedAt timestamp
   */
  async deleteVehicle(vehicleId: string) {
    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Assign a driver to a vehicle
   */
  async assignDriverToVehicle(vehicleId: string, driverId: string) {
    // First unassign any existing active assignments for this vehicle
    await prisma.vehicleAssignment.updateMany({
      where: { vehicleId, isActive: true },
      data: { isActive: false, unassignedAt: new Date() },
    });

    // Create new assignment
    return prisma.vehicleAssignment.create({
      data: {
        vehicleId,
        driverId,
        isActive: true,
      },
      include: {
        driver: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  },

  /**
   * Unassign a driver from a vehicle
   */
  async unassignDriver(vehicleId: string) {
    return prisma.vehicleAssignment.updateMany({
      where: { vehicleId, isActive: true },
      data: { isActive: false, unassignedAt: new Date() },
    });
  },

  /**
   * Get all active drivers for assignment dropdown
   */
  async getAvailableDrivers() {
    return prisma.driver.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { user: { name: "asc" } },
    });
  },

  /**
   * Get vehicle statistics for dashboard
   */
  async getVehicleStats(userRole: string, userId?: string) {
    let where: Prisma.VehicleWhereInput = {
      deletedAt: null,
    };

    if (userRole === "driver" && userId) {
      where = {
        ...where,
        assignments: {
          some: {
            driverId: userId,
            isActive: true,
          },
        },
      };
    }

    const [
      totalVehicles,
      availableVehicles,
      inUseVehicles,
      maintenanceVehicles,
    ] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.count({ where: { ...where, status: "AVAILABLE" } }),
      prisma.vehicle.count({ where: { ...where, status: "IN_USE" } }),
      prisma.vehicle.count({ where: { ...where, status: "MAINTENANCE" } }),
    ]);

    return {
      totalVehicles,
      availableVehicles,
      inUseVehicles,
      maintenanceVehicles,
    };
  },

  /**
   * Get all active vehicles (for filters/dropdowns)
   */
  async getActiveVehicles() {
    return prisma.vehicle.findMany({
      where: { deletedAt: null, status: "AVAILABLE" },
      select: { id: true, plate: true, model: true },
      orderBy: { plate: "asc" },
    });
  },

  /**
   * Check if a driver is assigned to a vehicle
   */
  async isDriverAssignedToVehicle(
    vehicleId: string,
    driverId: string,
  ): Promise<boolean> {
    const assignment = await prisma.vehicleAssignment.findFirst({
      where: {
        vehicleId,
        driverId,
        isActive: true,
      },
    });
    return !!assignment;
  },

  /**
   * Get the currently assigned driver for a vehicle
   */
  async getCurrentDriver(vehicleId: string) {
    const assignment = await prisma.vehicleAssignment.findFirst({
      where: {
        vehicleId,
        isActive: true,
      },
      include: {
        driver: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
      },
    });
    return assignment?.driver ?? null;
  },
};
