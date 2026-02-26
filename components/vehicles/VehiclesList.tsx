"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleStatusBadge } from "@/components/shared";
import { Trash2, Edit2 } from "lucide-react";
import { deleteVehicleAction } from "@/lib/vehicles/actions/vehicle.actions";
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
  assignments?: any[];
}

interface VehiclesListProps {
  vehicles: Vehicle[];
  userRole: string;
  onEdit: (vehicle: Vehicle) => void;
  onRefresh: () => void;
}

export function VehiclesList({
  vehicles,
  userRole,
  onEdit,
  onRefresh,
}: VehiclesListProps) {
  const canManage = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      const result = await deleteVehicleAction(vehicleId);
      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Failed to delete vehicle");
      }
    } catch (error) {
      alert("An error occurred while deleting the vehicle");
    }
  };

  if (vehicles.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No vehicles found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-[11px] font-bold uppercase tracking-wide text-muted-foreground border-b">
              {[
                "Plate",
                "Model",
                "VIN",
                "Capacity",
                "KM Usage",
                "Monthly Rent",
                "Salik",
                "Owner",
                "Reg. Expiry",
                "Status",
                ...(canManage ? ["Actions"] : []),
              ].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                  {vehicle.plate}
                </td>
                <td className="px-4 py-3 font-semibold">{vehicle.model}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {vehicle.vin}
                </td>
                <td className="px-4 py-3 font-mono">{vehicle.capacity} pax</td>
                <td className="px-4 py-3 font-mono">
                  {vehicle.kmUsage.toLocaleString()} km
                </td>
                <td className="px-4 py-3 font-mono font-semibold">
                  AED {vehicle.monthlyRent.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  AED {vehicle.salik.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {vehicle.owner ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {vehicle.registrationExpiry
                    ? new Date(vehicle.registrationExpiry).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <VehicleStatusBadge status={vehicle.status} />
                </td>
                {canManage && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(vehicle)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vehicle.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
