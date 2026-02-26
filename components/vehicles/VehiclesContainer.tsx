"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { VehiclesList } from "./VehiclesList";
import { VehiclesFormDrawer } from "./VehiclesFormDrawer";
import { VehiclesHeader } from "./VehiclesHeader";
import {
  getVehiclesAction,
  getVehicleStatsAction,
  deleteVehicleAction,
} from "@/lib/vehicles/actions/vehicle.actions";
import { VehicleStatus } from "@/lib/data";

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  vin: string;
  registrationExpiry: Date | string;
  capacity: number;
  kmUsage: number;
  monthlyRent: number;
  salik: number;
  owner?: string;
  status: VehicleStatus;
  lastMaintenance?: Date | string;
  nextMaintenanceDate?: Date | string;
  assignments?: any[];
}

interface VehicleStats {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
}

export function VehiclesContainer() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "DRIVER";

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<VehicleStats | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Load vehicles on mount
  useEffect(() => {
    loadVehicles();
    loadStats();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const result = await getVehiclesAction();
      if (result.success) {
        setVehicles(result.data || []);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getVehicleStatsAction();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleCreate = () => {
    setSelectedVehicle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDelete = async (vehicleId: string) => {
    try {
      const result = await deleteVehicleAction(vehicleId);
      if (result.success) {
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
        loadStats();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    }
  };

  const handleFormSuccess = () => {
    loadVehicles();
    loadStats();
  };

  return (
    <main className="space-y-8">
      <VehiclesHeader
        stats={stats}
        userRole={userRole}
        onCreateClick={handleCreate}
      />

      <VehiclesList
        vehicles={vehicles}
        userRole={userRole}
        onEdit={handleEdit}
        onRefresh={loadVehicles}
      />

      <VehiclesFormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        vehicle={selectedVehicle}
        userRole={userRole}
      />
    </main>
  );
}
