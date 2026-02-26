"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DriverStatus } from "@prisma/client";

interface Driver {
  id: string;
  status: DriverStatus;
  rating: number;
  licenseNumber: string;
  licenseExpiry: string | Date;
  totalTrips: number;
  totalKm: number;
  averageRating: number;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface DriversFormDrawerProps {
  isOpen: boolean;
  mode: "create" | "edit" | "view";
  driver?: Driver | undefined;
  onClose: () => void;
  onSave?: (data: any) => Promise<void>;
  isSaving?: boolean;
}

export function DriversFormDrawer({
  isOpen,
  mode,
  driver,
  onClose,
  onSave,
  isSaving = false,
}: DriversFormDrawerProps) {
  const [formData, setFormData] = useState<Partial<Driver> | null>(null);

  useEffect(() => {
    if (isOpen && driver && (mode === "edit" || mode === "view")) {
      setFormData(driver);
    } else if (isOpen && mode === "create") {
      setFormData({
        status: "AVAILABLE" as DriverStatus,
        rating: 0,
        licenseNumber: "",
        licenseExpiry: new Date(),
        totalTrips: 0,
        totalKm: 0,
        averageRating: 0,
      });
    }
  }, [isOpen, mode, driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await onSave?.(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save driver:", error);
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create"
              ? "Add Driver"
              : mode === "edit"
                ? "Edit Driver"
                : "Driver Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {mode === "view" && formData ? (
            // View Mode
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Driver Name
                </label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formData.user?.name || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-gray-900 mt-1">
                  {formData.user?.email || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="text-gray-900 mt-1">
                  {formData.user?.phone || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  License Number
                </label>
                <p className="text-gray-900 mt-1">{formData.licenseNumber}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  License Expiry
                </label>
                <p className="text-gray-900 mt-1">
                  {formatDate(formData.licenseExpiry)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {formData.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Trips
                  </label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formData.totalTrips}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total KM
                  </label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formData.totalKm}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Average Rating
                </label>
                <p className="text-2xl font-bold text-yellow-500 mt-1">
                  {formData.averageRating?.toFixed(1)}
                </p>
              </div>
            </div>
          ) : (
            // Edit/Create Mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  value={formData?.licenseNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData!, licenseNumber: e.target.value })
                  }
                  placeholder="e.g., DL-2024-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  value={formatDate(formData?.licenseExpiry)}
                  onChange={(e) =>
                    setFormData({ ...formData!, licenseExpiry: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData?.status || "AVAILABLE"}
                  onChange={(e) =>
                    setFormData({
                      ...formData!,
                      status: e.target.value as DriverStatus,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "view"}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="OFF_DUTY">Off Duty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData?.rating || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData!,
                      rating: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Trips
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData?.totalTrips || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData!,
                      totalTrips: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total KM
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData?.totalKm || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData!,
                      totalKm: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Rating
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData?.averageRating || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData!,
                      averageRating: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "view"}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          {mode !== "view" && (
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isSaving
                  ? "Saving..."
                  : mode === "create"
                    ? "Add Driver"
                    : "Save Changes"}
              </button>
            </div>
          )}

          {mode === "view" && (
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
