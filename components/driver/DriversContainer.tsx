"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { DriversHeader } from "./DriversHeader";
import { DriversList } from "./DriversList";
import { DriversFormDrawer } from "./DriversFormDrawer";
import {
  getDrivers,
  updateDriver,
  deleteDriver,
  getDriverStats,
} from "@/lib/drivers/actions/driver.actions";

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

interface DriverStats {
  totalDrivers: number;
  availableDrivers: number;
  onTripDrivers: number;
  offDutyDrivers: number;
}

export function DriversContainer() {
  const { data: session } = useSession();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Load drivers and stats
  const loadDrivers = useCallback(async () => {
    try {
      setIsLoading(true);
      const [driversData, statsData] = await Promise.all([
        getDrivers(),
        getDriverStats(),
      ]);
      setDrivers(driversData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load drivers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (session?.user?.id) {
      loadDrivers();
    }
  }, [session?.user?.id, loadDrivers]);

  // Handle create
  const handleCreate = useCallback(() => {
    setSelectedDriver(null);
    setDrawerMode("create");
    setDrawerOpen(true);
  }, []);

  // Handle view
  const handleView = useCallback((driver: Driver) => {
    setSelectedDriver(driver);
    setDrawerMode("view");
    setDrawerOpen(true);
  }, []);

  // Handle edit
  const handleEdit = useCallback((driver: Driver) => {
    setSelectedDriver(driver);
    setDrawerMode("edit");
    setDrawerOpen(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback(async (driver: Driver) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      await deleteDriver(driver.id);
      setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              totalDrivers: prev.totalDrivers - 1,
              ...(driver.status === "AVAILABLE" && {
                availableDrivers: prev.availableDrivers - 1,
              }),
              ...(driver.status === "ON_TRIP" && {
                onTripDrivers: prev.onTripDrivers - 1,
              }),
              ...(driver.status === "OFF_DUTY" && {
                offDutyDrivers: prev.offDutyDrivers - 1,
              }),
            }
          : null,
      );
    } catch (error) {
      console.error("Failed to delete driver:", error);
    }
  }, []);

  // Handle save
  const handleSave = useCallback(
    async (data: Partial<Driver>) => {
      if (!selectedDriver?.id) return;

      try {
        setIsSaving(true);
        const updated = await updateDriver(selectedDriver.id, data);
        setDrivers((prev) =>
          prev.map((d) => (d.id === selectedDriver.id ? updated : d)),
        );
        setDrawerOpen(false);
        await loadDrivers(); // Refresh stats
      } catch (error) {
        console.error("Failed to save driver:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [selectedDriver?.id, loadDrivers],
  );

  // Filter drivers
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      !searchTerm ||
      driver.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.user?.phone?.includes(searchTerm) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const userRole = (session?.user as any)?.role || "DRIVER";

  return (
    <div className="space-y-6">
      <DriversHeader
        stats={stats}
        isLoading={isLoading}
        onCreateClick={userRole !== "DRIVER" ? handleCreate : undefined}
      />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by name, email, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="OFF_DUTY">Off Duty</option>
          </select>
        </div>
      </div>

      {/* Drivers List */}
      <DriversList
        drivers={filteredDrivers}
        isLoading={isLoading}
        onEdit={userRole !== "DRIVER" ? handleEdit : undefined}
        onView={handleView}
        onDelete={userRole !== "DRIVER" ? handleDelete : undefined}
        userRole={userRole}
      />

      {/* Form Drawer */}
      <DriversFormDrawer
        isOpen={drawerOpen}
        mode={drawerMode}
        driver={selectedDriver || undefined}
        onClose={() => setDrawerOpen(false)}
        onSave={drawerMode !== "view" ? handleSave : undefined}
        isSaving={isSaving}
      />
    </div>
  );
}
