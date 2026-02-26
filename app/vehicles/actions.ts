'use server'

import { auth } from '@/lib/auth'
import { vehicleService } from '@/lib/vehicles/services/vehicle.service'
import { vehicleRepository } from '@/lib/vehicles/repositories/vehicle.repository'

/**
 * Server Actions for Vehicles
 * All actions are protected by NextAuth and role-based authorization
 * Returns type-safe responses with errors
 */

export async function getVehiclesAction() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    const vehicles = await vehicleService.getVehicles(session.user.id, userRole)

    return { success: true, data: vehicles }
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch vehicles',
    }
  }
}

export async function getVehicleStatsAction() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    const stats = await vehicleRepository.getVehicleStats(userRole, session.user.id)

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error fetching vehicle stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics',
    }
  }
}

export async function createVehicleAction(vehicleData: {
  plate: string
  model: string
  brand?: string
  year?: number
  fuelType?: string
  capacity?: number
  notes?: string
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    const vehicle = await vehicleService.createVehicle(
      session.user.id,
      userRole,
      vehicleData,
    )

    return { success: true, data: vehicle }
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create vehicle',
    }
  }
}

export async function updateVehicleAction(
  vehicleId: string,
  vehicleData: {
    plate?: string
    model?: string
    brand?: string
    year?: number
    fuelType?: string
    capacity?: number
    status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
    notes?: string
  },
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    const vehicle = await vehicleService.updateVehicle(
      vehicleId,
      session.user.id,
      userRole,
      vehicleData,
    )

    return { success: true, data: vehicle }
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update vehicle',
    }
  }
}

export async function deleteVehicleAction(vehicleId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    await vehicleService.deleteVehicle(vehicleId, session.user.id, userRole)

    return { success: true, data: { id: vehicleId } }
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete vehicle',
    }
  }
}

export async function assignDriverAction(vehicleId: string, driverId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    const assignment = await vehicleService.assignDriver(
      vehicleId,
      driverId,
      session.user.id,
      userRole,
    )

    return { success: true, data: assignment }
  } catch (error) {
    console.error('Error assigning driver:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign driver',
    }
  }
}

export async function unassignDriverAction(assignmentId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    await vehicleService.unassignDriver(assignmentId, session.user.id, userRole)

    return { success: true, data: { id: assignmentId } }
  } catch (error) {
    console.error('Error unassigning driver:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unassign driver',
    }
  }
}

export async function getAvailableDriversAction() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userRole = (session.user as any).role || 'driver'
    const drivers = await vehicleService.getAvailableDrivers(session.user.id, userRole)

    return { success: true, data: drivers }
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch drivers',
    }
  }
}
