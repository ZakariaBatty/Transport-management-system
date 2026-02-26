"use client";

import { Trash2, Edit2, Eye, Star, Phone, Mail } from "lucide-react";

interface Driver {
  id: string;
  userId: string;
  status: string;
  rating: number;
  licenseNumber: string;
  licenseExpiry: string | Date;
  totalTrips: number;
  totalKm: number;
  averageRating: number;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  vehicleAssignments?: any[];
}

interface DriversListProps {
  drivers: Driver[];
  isLoading?: boolean;
  onEdit?: (driver: Driver) => void;
  onView?: (driver: Driver) => void;
  onDelete?: (driver: Driver) => void;
  userRole?: string;
}

export function DriversList({
  drivers,
  isLoading = false,
  onEdit,
  onView,
  onDelete,
  userRole = "DRIVER",
}: DriversListProps) {
  const canModify = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      AVAILABLE: "bg-green-50 text-green-700 border-green-200",
      ON_TRIP: "bg-blue-50 text-blue-700 border-blue-200",
      OFF_DUTY: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: "Available",
      ON_TRIP: "On Trip",
      OFF_DUTY: "Off Duty",
    };
    return labels[status] || status;
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading drivers...</div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 py-12 text-center">
        <p className="text-gray-500">No drivers found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {driver.user?.name || "Unknown"}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(driver.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {driver.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(driver.status)}`}
            >
              {getStatusLabel(driver.status)}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              {driver.user?.phone || "N/A"}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              {driver.user?.email || "N/A"}
            </div>
          </div>

          {/* License & Stats */}
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">License:</span>
              <span className="font-medium text-gray-900">
                {driver.licenseNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expires:</span>
              <span className="font-medium text-gray-900">
                {formatDate(driver.licenseExpiry)}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {driver.totalTrips}
              </p>
              <p className="text-xs text-gray-600">Trips</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {driver.totalKm}
              </p>
              <p className="text-xs text-gray-600">km</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">
                {driver.vehicleAssignments?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Vehicles</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onView?.(driver)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            {canModify && (
              <>
                <button
                  onClick={() => onEdit?.(driver)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(driver)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
