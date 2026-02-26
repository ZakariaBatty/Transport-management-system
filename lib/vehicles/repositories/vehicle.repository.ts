import { prisma } from '@/lib/db/client'
import { Prisma } from '@prisma/client'

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
      ...(userRole === 'driver' && { assignments: { some: { driverId: userId } } }),
    }

    return prisma.vehicle.findMany({
      where,
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
        maintenanceRecords: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
      orderBy: { plate: 'asc' },
    })
  },

  /**
   * Find a single vehicle by ID with full relations
   */
  async findVehicleById(vehicleId: string) {
    return prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        assignments: {
          include: {
            driver: {
              include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
              },
            },
          },
          orderBy: { assignedAt: 'desc' },
        },
        maintenanceRecords: {
          orderBy: { date: 'desc' },
        },
      },
    })
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
        maintenanceRecords: true,
      },
    })
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
          include: {
            driver: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
        maintenanceRecords: true,
      },
    })
  },

  /**
   * Soft delete a vehicle by setting deletedAt timestamp
   */
  async deleteVehicle(vehicleId: string) {
    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: { deletedAt: new Date() },
    })
  },

  /**
   * Assign a driver to a vehicle
   */
  async assignDriverToVehicle(vehicleId: string, driverId: string, assignedByUserId: string) {
    return prisma.vehicleAssignment.create({
      data: {
        vehicle: { connect: { id: vehicleId } },
        driver: { connect: { id: driverId } },
        assignedByUser: { connect: { id: assignedByUserId } },
        assignedAt: new Date(),
      },
      include: {
        driver: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    })
  },

  /**
   * Unassign a driver from a vehicle
   */
  async unassignDriver(assignmentId: string) {
    return prisma.vehicleAssignment.delete({
      where: { id: assignmentId },
    })
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
      orderBy: { user: { name: 'asc' } },
    })
  },

  /**
   * Get vehicle statistics for dashboard
   */
  async getVehicleStats(userRole: string, userId?: string) {
    let where: Prisma.VehicleWhereInput = {
      deletedAt: null,
    }

    if (userRole === 'driver' && userId) {
      where = {
        ...where,
        assignments: { some: { driverId: userId } },
      }
    }

    const [totalVehicles, activeVehicles, maintenanceVehicles, inactiveVehicles] =
      await Promise.all([
        prisma.vehicle.count({ where }),
        prisma.vehicle.count({ where: { ...where, status: 'ACTIVE' } }),
        prisma.vehicle.count({ where: { ...where, status: 'MAINTENANCE' } }),
        prisma.vehicle.count({ where: { ...where, status: 'INACTIVE' } }),
      ])

    return {
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      inactiveVehicles,
    }
  },

  /**
   * Get all active vehicles (for filters/dropdowns)
   */
  async getActiveVehicles() {
    return prisma.vehicle.findMany({
      where: { deletedAt: null, status: 'ACTIVE' },
      select: { id: true, plate: true, model: true },
      orderBy: { plate: 'asc' },
    })
  },

  /**
   * Check if a driver is assigned to a vehicle
   */
  async isDriverAssignedToVehicle(vehicleId: string, driverId: string): Promise<boolean> {
    const assignment = await prisma.vehicleAssignment.findFirst({
      where: {
        vehicleId,
        driverId,
      },
    })
    return !!assignment
  },
}
