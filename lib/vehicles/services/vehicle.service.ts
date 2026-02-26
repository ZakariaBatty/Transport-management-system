import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/client'
import { vehicleRepository } from '../repositories/vehicle.repository'

/**
 * Vehicle Service
 * Contains business logic with role-based authorization
 * All CRUD operations are protected by role checks
 */

interface VehicleCreateData {
  plate: string
  model: string
  brand?: string
  year?: number
  fuelType?: string
  capacity?: number
  status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
  notes?: string
}

interface VehicleUpdateData {
  plate?: string
  model?: string
  brand?: string
  year?: number
  fuelType?: string
  capacity?: number
  status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
  notes?: string
}

export const vehicleService = {
  /**
   * Get vehicles for a user based on their role
   */
  async getVehicles(userId: string, userRole: string) {
    if (!['driver', 'manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot view vehicles')
    }

    return vehicleRepository.findVehiclesForUser(userId, userRole)
  },

  /**
   * Get a single vehicle with authorization check
   */
  async getVehicle(vehicleId: string, userId: string, userRole: string) {
    const vehicle = await vehicleRepository.findVehicleById(vehicleId)

    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    // Check authorization
    if (userRole === 'driver') {
      const isAssigned = await vehicleRepository.isDriverAssignedToVehicle(vehicleId, userId)
      if (!isAssigned) {
        throw new Error('Unauthorized: Cannot access this vehicle')
      }
    }

    return vehicle
  },

  /**
   * Create a new vehicle
   */
  async createVehicle(userId: string, userRole: string, vehicleData: VehicleCreateData) {
    // Only managers and admins can create vehicles
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot create vehicles')
    }

    const createInput: Prisma.VehicleCreateInput = {
      plate: vehicleData.plate.toUpperCase(),
      model: vehicleData.model,
      brand: vehicleData.brand,
      year: vehicleData.year,
      fuelType: vehicleData.fuelType,
      capacity: vehicleData.capacity,
      status: vehicleData.status ?? 'ACTIVE',
      notes: vehicleData.notes,
    }

    return vehicleRepository.createVehicle(createInput)
  },

  /**
   * Update a vehicle
   */
  async updateVehicle(
    vehicleId: string,
    userId: string,
    userRole: string,
    vehicleData: VehicleUpdateData,
  ) {
    // Only managers and admins can update vehicles
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot update vehicles')
    }

    // Verify vehicle exists
    const vehicle = await vehicleRepository.findVehicleById(vehicleId)
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    const updateInput: Prisma.VehicleUpdateInput = {}

    if (vehicleData.plate) updateInput.plate = vehicleData.plate.toUpperCase()
    if (vehicleData.model) updateInput.model = vehicleData.model
    if (vehicleData.brand) updateInput.brand = vehicleData.brand
    if (vehicleData.year !== undefined) updateInput.year = vehicleData.year
    if (vehicleData.fuelType) updateInput.fuelType = vehicleData.fuelType
    if (vehicleData.capacity !== undefined) updateInput.capacity = vehicleData.capacity
    if (vehicleData.status) updateInput.status = vehicleData.status
    if (vehicleData.notes !== undefined) updateInput.notes = vehicleData.notes

    return vehicleRepository.updateVehicle(vehicleId, updateInput)
  },

  /**
   * Delete a vehicle
   */
  async deleteVehicle(vehicleId: string, userId: string, userRole: string) {
    // Only super admins can delete vehicles
    if (userRole !== 'super_admin' && userRole !== 'admin') {
      throw new Error('Unauthorized: Cannot delete vehicles')
    }

    const vehicle = await vehicleRepository.findVehicleById(vehicleId)
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    return vehicleRepository.deleteVehicle(vehicleId)
  },

  /**
   * Assign a driver to a vehicle
   */
  async assignDriver(
    vehicleId: string,
    driverId: string,
    userId: string,
    userRole: string,
  ) {
    // Only managers and admins can assign drivers
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot assign drivers')
    }

    const vehicle = await vehicleRepository.findVehicleById(vehicleId)
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    })

    if (!driver) {
      throw new Error('Driver not found')
    }

    // Check if already assigned
    const existingAssignment = await prisma.vehicleAssignment.findFirst({
      where: { vehicleId, driverId },
    })

    if (existingAssignment) {
      throw new Error('Driver is already assigned to this vehicle')
    }

    return vehicleRepository.assignDriverToVehicle(vehicleId, driverId, userId)
  },

  /**
   * Unassign a driver from a vehicle
   */
  async unassignDriver(
    assignmentId: string,
    userId: string,
    userRole: string,
  ) {
    // Only managers and admins can unassign drivers
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot unassign drivers')
    }

    const assignment = await prisma.vehicleAssignment.findUnique({
      where: { id: assignmentId },
    })

    if (!assignment) {
      throw new Error('Assignment not found')
    }

    return vehicleRepository.unassignDriver(assignmentId)
  },

  /**
   * Get available drivers for assignment
   */
  async getAvailableDrivers(userId: string, userRole: string) {
    if (!['manager', 'admin', 'super_admin'].includes(userRole)) {
      throw new Error('Unauthorized: Cannot view drivers')
    }

    return vehicleRepository.getAvailableDrivers()
  },

  /**
   * Check if user can access vehicle
   */
  async canUserAccessVehicle(
    vehicleId: string,
    userId: string,
    userRole: string,
  ): Promise<boolean> {
    // Managers/Admins can access all vehicles
    if (['manager', 'admin', 'super_admin'].includes(userRole)) {
      return true
    }

    // Drivers can only access their assigned vehicles
    if (userRole === 'driver') {
      return vehicleRepository.isDriverAssignedToVehicle(vehicleId, userId)
    }

    return false
  },
}
