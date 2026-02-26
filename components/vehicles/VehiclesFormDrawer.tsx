"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";

import {
  updateVehicleAction,
  createVehicleAction,
  assignDriverAction,
  unassignDriverAction,
  getAvailableDriversAction,
} from "@/lib/vehicles/actions/vehicle.actions";

interface Vehicle {
  id?: string;
  model: string;
  plate: string;
  vin: string;
  registrationExpiry: string | Date;
  capacity: number;
  monthlyRent: number;
  salik?: number;
  owner?: string;
  kmUsage?: number;
  status?: string;
  lastMaintenance?: string | Date;
  nextMaintenanceDate?: string | Date;
  assignments?: any[];
}

interface Driver {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface VehiclesFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicle?: Vehicle | null;
  userRole: string;
}

export function VehiclesFormDrawer({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
  userRole,
}: VehiclesFormDrawerProps) {
  const [formData, setFormData] = useState<Vehicle>({
    model: "",
    plate: "",
    vin: "",
    registrationExpiry: new Date().toISOString().split("T")[0],
    capacity: 4,
    monthlyRent: 0,
    salik: 0,
    owner: "",
    kmUsage: 0,
    status: "AVAILABLE",
  });

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>("");

  const canManage = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  // Load available drivers
  const loadAvailableDrivers = async () => {
    setIsFetching(true);
    try {
      const result = await getAvailableDriversAction();
      if (result.success) {
        setDrivers(result.data || []);
      }
    } catch (err) {
      console.error("Error loading drivers:", err);
    } finally {
      setIsFetching(false);
    }
  };

  // Load available drivers when editing
  useEffect(() => {
    if (isOpen && canManage && vehicle?.id) {
      loadAvailableDrivers();
      const currentAssignment = vehicle.assignments?.[0];
      if (currentAssignment) {
        setSelectedDriver(currentAssignment.driverId);
      }
    }
  }, [isOpen, vehicle?.id, canManage]);

  // Load vehicle data if editing
  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        ...vehicle,
        registrationExpiry: vehicle.registrationExpiry
          ? new Date(vehicle.registrationExpiry).toISOString().split("T")[0]
          : "",
      });
    } else if (isOpen) {
      setFormData({
        model: "",
        plate: "",
        vin: "",
        registrationExpiry: new Date().toISOString().split("T")[0],
        capacity: 4,
        monthlyRent: 0,
        salik: 0,
        owner: "",
        kmUsage: 0,
        status: "AVAILABLE",
      });
    }
    setError("");
  }, [vehicle, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("monthlyRent") ||
        name.includes("salik") ||
        name.includes("kmUsage")
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.model || !formData.plate || !formData.vin) {
        setError("Please fill in all required fields");
        return;
      }

      if (vehicle?.id) {
        // Update existing vehicle
        const result = await updateVehicleAction(vehicle.id, {
          model: formData.model,
          plate: formData.plate,
          vin: formData.vin,
          registrationExpiry: new Date(formData.registrationExpiry),
          capacity: formData.capacity,
          monthlyRent: formData.monthlyRent,
          salik: formData.salik,
          owner: formData.owner,
          kmUsage: formData.kmUsage,
          status: (formData.status as any) || "AVAILABLE",
        });

        if (!result.success) {
          setError(result.error || "Failed to update vehicle");
          return;
        }

        // Handle driver assignment change if applicable
        if (
          selectedDriver &&
          selectedDriver !== vehicle.assignments?.[0]?.driverId
        ) {
          await assignDriverAction(vehicle.id, selectedDriver);
        }
      } else {
        // Create new vehicle
        const result = await createVehicleAction({
          model: formData.model,
          plate: formData.plate,
          vin: formData.vin,
          registrationExpiry: new Date(formData.registrationExpiry),
          capacity: formData.capacity,
          monthlyRent: formData.monthlyRent,
          salik: formData.salik,
          owner: formData.owner,
          kmUsage: formData.kmUsage,
        });

        if (!result.success) {
          setError(result.error || "Failed to create vehicle");
          return;
        }

        // Assign driver if selected
        if (selectedDriver && result.data?.id) {
          await assignDriverAction(result.data.id, selectedDriver);
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {vehicle?.id ? "Edit Vehicle" : "Add New Vehicle"}
          </SheetTitle>
          <SheetDescription>
            {vehicle?.id
              ? "Update vehicle details and assignments"
              : "Create a new vehicle in your fleet"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model">
              Model <span className="text-red-500">*</span>
            </Label>
            <Input
              id="model"
              name="model"
              placeholder="e.g., Toyota Coaster"
              value={formData.model}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Plate */}
          <div className="space-y-2">
            <Label htmlFor="plate">
              License Plate <span className="text-red-500">*</span>
            </Label>
            <Input
              id="plate"
              name="plate"
              placeholder="e.g., ABC 123"
              value={formData.plate}
              onChange={handleInputChange}
              disabled={isLoading || !!vehicle?.id}
              required
            />
          </div>

          {/* VIN */}
          <div className="space-y-2">
            <Label htmlFor="vin">
              VIN <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vin"
              name="vin"
              placeholder="Vehicle Identification Number"
              value={formData.vin}
              onChange={handleInputChange}
              disabled={isLoading || !!vehicle?.id}
              required
            />
          </div>

          {/* Registration Expiry */}
          <div className="space-y-2">
            <Label htmlFor="registrationExpiry">
              Registration Expiry <span className="text-red-500">*</span>
            </Label>
            <Input
              id="registrationExpiry"
              name="registrationExpiry"
              type="date"
              value={formData.registrationExpiry as string}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">
              Passenger Capacity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Monthly Rent */}
          <div className="space-y-2">
            <Label htmlFor="monthlyRent">
              Monthly Rent (AED) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="monthlyRent"
              name="monthlyRent"
              type="number"
              min="0"
              step="0.01"
              value={formData.monthlyRent}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Salik */}
          <div className="space-y-2">
            <Label htmlFor="salik">Salik (AED)</Label>
            <Input
              id="salik"
              name="salik"
              type="number"
              min="0"
              step="0.01"
              value={formData.salik || 0}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Owner */}
          <div className="space-y-2">
            <Label htmlFor="owner">Vehicle Owner</Label>
            <Input
              id="owner"
              name="owner"
              placeholder="Company or individual name"
              value={formData.owner || ""}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* KM Usage */}
          <div className="space-y-2">
            <Label htmlFor="kmUsage">KM Usage</Label>
            <Input
              id="kmUsage"
              name="kmUsage"
              type="number"
              min="0"
              value={formData.kmUsage || 0}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Status */}
          {vehicle?.id && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status as string}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Driver Assignment (for managers only) */}
          {canManage && vehicle?.id && (
            <div className="space-y-2">
              <Label htmlFor="DRIVER">Assign Driver</Label>
              <Select
                value={selectedDriver}
                onValueChange={setSelectedDriver}
                disabled={isFetching}
              >
                <SelectTrigger id="DRIVER">
                  <SelectValue placeholder="No Driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || isFetching}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {vehicle?.id ? "Updating..." : "Creating..."}
                </>
              ) : vehicle?.id ? (
                "Update Vehicle"
              ) : (
                "Create Vehicle"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
