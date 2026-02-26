import { Prisma, VehicleStatus } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import { vehicleRepository } from "../repositories/vehicle.repository";

/**
 * Vehicle Service
 * Contains business logic with role-based authorization
 * All CRUD operations are protected by role checks
 */

interface VehicleCreateData {
  model: string;
  plate: string;
  vin: string;
  registrationExpiry: string | Date;
  capacity: number;
  monthlyRent: number;
  salik?: number;
  owner?: string;
  kmUsage?: number;
}

interface VehicleUpdateData {
  model?: string;
  plate?: string;
  vin?: string;
  registrationExpiry?: string | Date;
  capacity?: number;
  monthlyRent?: number;
  salik?: number;
  owner?: string;
  kmUsage?: number;
  status?: VehicleStatus;
  lastMaintenance?: string | Date;
  nextMaintenanceDate?: string | Date;
}

export const vehicleService = {
  /**
   * Get vehicles for a user based on their role
   */
  async getVehicles(userId: string, userRole: string) {
    if (!["driver", "MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot view vehicles");
    }

    return vehicleRepository.findVehiclesForUser(userId, userRole);
  },

  /**
   * Get a single vehicle with authorization check
   */
  async getVehicle(vehicleId: string, userId: string, userRole: string) {
    const vehicle = await vehicleRepository.findVehicleById(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Check authorization
    const canViewAllVehicles = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(
      userRole,
    );

    if (!canViewAllVehicles) {
      // Drivers can only view their assigned vehicles
      const isAssigned = await vehicleRepository.isDriverAssignedToVehicle(
        vehicleId,
        userId,
      );
      if (!isAssigned) {
        throw new Error("Unauthorized: Cannot view this vehicle");
      }
    }

    return vehicle;
  },

  /**
   * Create a new vehicle (Manager/Admin only)
   */
  async createVehicle(userRole: string, vehicleData: VehicleCreateData) {
    // Validation: Only managers and admins can create vehicles
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot create vehicles");
    }

    // Validate required fields
    if (!vehicleData.model || !vehicleData.plate || !vehicleData.vin) {
      throw new Error("Missing required fields: model, plate, vin");
    }

    // Check if plate already exists
    const existingPlate = await prisma.vehicle.findUnique({
      where: { plate: vehicleData.plate },
    });
    if (existingPlate && !existingPlate.deletedAt) {
      throw new Error("Vehicle with this plate already exists");
    }

    // Check if VIN already exists
    const existingVin = await prisma.vehicle.findUnique({
      where: { vin: vehicleData.vin },
    });
    if (existingVin && !existingVin.deletedAt) {
      throw new Error("Vehicle with this VIN already exists");
    }

    const createInput: Prisma.VehicleCreateInput = {
      model: vehicleData.model,
      plate: vehicleData.plate,
      vin: vehicleData.vin,
      registrationExpiry: new Date(vehicleData.registrationExpiry),
      capacity: vehicleData.capacity,
      monthlyRent: vehicleData.monthlyRent,
      salik: vehicleData.salik ?? 0,
      owner: vehicleData.owner,
      kmUsage: vehicleData.kmUsage ?? 0,
    };

    return vehicleRepository.createVehicle(createInput);
  },

  /**
   * Assign a driver to a vehicle
   */
  async assignDriver(vehicleId: string, driverId: string, userRole: string) {
    // Only managers and admins can assign drivers
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot assign drivers");
    }

    const vehicle = await vehicleRepository.findVehicleById(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new Error("Driver not found");
    }

    // Check if already assigned
    const existingAssignment = await prisma.vehicleAssignment.findFirst({
      where: { vehicleId, driverId },
    });

    if (existingAssignment) {
      throw new Error("Driver is already assigned to this vehicle");
    }

    return vehicleRepository.assignDriverToVehicle(vehicleId, driverId);
  },

  /**
   * Unassign a driver from a vehicle
   */
  async unassignDriver(assignmentId: string, userId: string, userRole: string) {
    // Only managers and admins can unassign drivers
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot unassign drivers");
    }

    const assignment = await prisma.vehicleAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    return vehicleRepository.unassignDriver(assignmentId);
  },

  /**
   * Get available drivers for assignment
   */
  async getAvailableDrivers(userId: string, userRole: string) {
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot view drivers");
    }

    return vehicleRepository.getAvailableDrivers();
  },

  /**
   * Update an existing vehicle (Manager/Admin only)
   */
  async updateVehicle(
    vehicleId: string,
    userRole: string,
    vehicleData: VehicleUpdateData,
  ) {
    // Validation: Only managers and admins can update vehicles
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot update vehicles");
    }

    // Verify vehicle exists
    const vehicle = await vehicleRepository.findVehicleById(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Check if new plate is unique (if being changed)
    if (vehicleData.plate && vehicleData.plate !== vehicle.plate) {
      const existingPlate = await prisma.vehicle.findUnique({
        where: { plate: vehicleData.plate },
      });
      if (existingPlate && !existingPlate.deletedAt) {
        throw new Error("Vehicle with this plate already exists");
      }
    }

    // Check if new VIN is unique (if being changed)
    if (vehicleData.vin && vehicleData.vin !== vehicle.vin) {
      const existingVin = await prisma.vehicle.findUnique({
        where: { vin: vehicleData.vin },
      });
      if (existingVin && !existingVin.deletedAt) {
        throw new Error("Vehicle with this VIN already exists");
      }
    }

    // Build update data
    const updateInput: Prisma.VehicleUpdateInput = {};

    if (vehicleData.model) updateInput.model = vehicleData.model;
    if (vehicleData.plate) updateInput.plate = vehicleData.plate;
    if (vehicleData.vin) updateInput.vin = vehicleData.vin;
    if (vehicleData.registrationExpiry)
      updateInput.registrationExpiry = new Date(vehicleData.registrationExpiry);
    if (vehicleData.capacity !== undefined)
      updateInput.capacity = vehicleData.capacity;
    if (vehicleData.monthlyRent !== undefined)
      updateInput.monthlyRent = vehicleData.monthlyRent;
    if (vehicleData.salik !== undefined) updateInput.salik = vehicleData.salik;
    if (vehicleData.owner !== undefined) updateInput.owner = vehicleData.owner;
    if (vehicleData.kmUsage !== undefined)
      updateInput.kmUsage = vehicleData.kmUsage;
    if (vehicleData.status) updateInput.status = vehicleData.status;
    if (vehicleData.lastMaintenance)
      updateInput.lastMaintenance = new Date(vehicleData.lastMaintenance);
    if (vehicleData.nextMaintenanceDate)
      updateInput.nextMaintenanceDate = new Date(
        vehicleData.nextMaintenanceDate,
      );

    return vehicleRepository.updateVehicle(vehicleId, updateInput);
  },
};
