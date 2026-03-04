"use client";

import { Users, CheckCircle, Car, Shield } from "lucide-react";
import { StatCard } from "@/components/shared";

interface UsersHeaderProps {
  onCreateClick: () => void;
  stats: {
    totalUsers: number;
    activeUsers: number;
    driverCount: number;
    adminCount: number;
  };
}

export function UsersHeader({ onCreateClick, stats }: UsersHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">
            Manage team members and access permissions
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <span className="w-5 h-5">+</span>
          New User
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          variant="default"
        />
        <StatCard
          label="Active"
          value={stats.activeUsers}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="Drivers"
          value={stats.driverCount}
          icon={Car}
          variant="accent"
        />
        <StatCard
          label="Admins"
          value={stats.adminCount}
          icon={Shield}
          variant="danger"
        />
      </div>
    </div>
  );
}
