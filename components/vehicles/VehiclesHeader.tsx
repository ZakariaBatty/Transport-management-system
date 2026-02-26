"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared";
import { Truck, AlertCircle, Wrench, Power } from "lucide-react";

interface VehicleStats {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
}

interface VehiclesHeaderProps {
  stats?: VehicleStats;
  userRole: string;
  onCreateClick: () => void;
}

export function VehiclesHeader({
  stats,
  userRole,
  onCreateClick,
}: VehiclesHeaderProps) {
  const canCreate = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  return (
    <div className="mb-8">
      {/* Header with Title and Action Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vehicles</h1>
          <p className="mt-1 text-slate-500">Manage and monitor your fleet</p>
        </div>
        {canCreate && (
          <Button
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + New Vehicle
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Vehicles"
          value={stats?.totalVehicles ?? 0}
          icon={Truck}
          variant="default"
        />
        <StatCard
          label="Available"
          value={stats?.availableVehicles ?? 0}
          icon={Power}
          variant="success"
        />
        <StatCard
          label="In Use"
          value={stats?.inUseVehicles ?? 0}
          icon={AlertCircle}
          variant="accent"
        />
        <StatCard
          label="Maintenance"
          value={stats?.maintenanceVehicles ?? 0}
          icon={Wrench}
          variant="warning"
        />
      </div>
    </div>
  );
}
