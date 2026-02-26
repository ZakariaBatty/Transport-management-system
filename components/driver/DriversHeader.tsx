"use client";

import { useCallback, useMemo } from "react";
import { Users, CheckCircle, Activity, Star } from "lucide-react";
import { StatCard } from "@/components/shared";

interface DriverStats {
  totalDrivers: number;
  availableDrivers: number;
  onTripDrivers: number;
  offDutyDrivers: number;
}

interface DriversHeaderProps {
  stats?: DriverStats;
  isLoading?: boolean;
  onCreateClick?: () => void;
}

export function DriversHeader({
  stats,
  isLoading = false,
  onCreateClick,
}: DriversHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Driver Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all drivers in your fleet
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add Driver
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Drivers"
          value={stats?.totalDrivers ?? 0}
          icon={Users}
          variant="default"
        />
        <StatCard
          label="Available"
          value={stats?.availableDrivers ?? 0}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="On Trip"
          value={stats?.onTripDrivers ?? 0}
          icon={Activity}
          variant="accent"
        />
        <StatCard
          label="Off Duty"
          value={stats?.offDutyDrivers ?? 0}
          icon={Star}
          variant="default"
        />
      </div>
    </div>
  );
}
