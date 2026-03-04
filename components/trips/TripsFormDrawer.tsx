"use client";

import React, { useEffect, useState } from "react";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/Drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Agency {
  id: string;
  name: string;
}

interface Hotel {
  id: string;
  name: string;
  city: string;
}

interface Driver {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: string;
}

interface Trip {
  id: string;
  tripDate: string | Date;
  departureTime: string;
  estimatedArrivalTime?: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  destination: string;
  type: "OUT" | "IN";
  status: string;
  passengersCount: number;
  kmStart: number;
  kmEnd?: number | null;
  distanceTravelled?: number | null;
  tripPrice?: number | null;
  actualCost?: number | null;
  notes?: string | null;
  agencyId: string;
  hotelId: string;
  vehicleId: string;
  driverId: string;
}

interface TripsFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: Trip | null;
  agencies: Agency[];
  hotels: Hotel[];
  drivers: Driver[];
  vehicles: Vehicle[];
  userRole: string;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function TripsFormDrawer({
  isOpen,
  onClose,
  trip,
  agencies,
  hotels,
  drivers,
  vehicles,
  userRole,
  onSubmit,
  isLoading,
}: TripsFormDrawerProps) {
  const [form, setForm] = useState<any>({
    tripDate: "",
    departureTime: "",
    estimatedArrivalTime: "",
    pickupLocation: "",
    dropoffLocation: "",
    destination: "",
    type: "OUT",
    status: "SCHEDULED",
    passengersCount: "",
    kmStart: "",
    kmEnd: "",
    distanceTravelled: "",
    tripPrice: "",
    actualCost: "",
    notes: "",
    agencyId: "",
    hotelId: "",
    vehicleId: "",
    driverId: "",
  });

  const isDriver = userRole === "DRIVER";
  const isEditMode = !!trip;

  // Populate form when trip is set
  useEffect(() => {
    if (trip) {
      const tripDate = new Date(trip.tripDate);
      setForm({
        tripDate: tripDate.toISOString().split("T")[0],
        departureTime: trip.departureTime,
        estimatedArrivalTime: trip.estimatedArrivalTime || "",
        pickupLocation: trip.pickupLocation,
        dropoffLocation: trip.dropoffLocation,
        destination: trip.destination,
        type: trip.type,
        status: trip.status,
        passengersCount: trip.passengersCount.toString(),
        kmStart: trip.kmStart.toString(),
        kmEnd: trip.kmEnd?.toString() || "",
        distanceTravelled: trip.distanceTravelled?.toString() || "",
        tripPrice: trip.tripPrice?.toString() || "",
        actualCost: trip.actualCost?.toString() || "",
        notes: trip.notes || "",
        agencyId: trip.agencyId,
        hotelId: trip.hotelId,
        vehicleId: trip.vehicleId,
        driverId: trip.driverId,
      });
    } else {
      // Reset form for create
      setForm({
        tripDate: "",
        departureTime: "",
        estimatedArrivalTime: "",
        pickupLocation: "",
        dropoffLocation: "",
        destination: "",
        type: "OUT",
        status: "SCHEDULED",
        passengersCount: "",
        kmStart: "",
        kmEnd: "",
        distanceTravelled: "",
        tripPrice: "",
        actualCost: "",
        notes: "",
        agencyId: "",
        hotelId: "",
        vehicleId: "",
        driverId: "",
      });
    }
  }, [trip, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.tripDate ||
      !form.departureTime ||
      !form.agencyId ||
      !form.hotelId ||
      !form.vehicleId ||
      !form.passengersCount ||
      form.passengersCount < 0 ||
      !form.kmStart ||
      form.kmStart < 0 ||
      !form.pickupLocation ||
      !form.destination
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit({
        ...form,
        passengersCount: parseInt(form.passengersCount),
        kmStart: parseInt(form.kmStart),
        kmEnd: form.kmEnd ? parseInt(form.kmEnd) : undefined,
        distanceTravelled: form.distanceTravelled
          ? parseInt(form.distanceTravelled)
          : undefined,
        tripPrice: form.tripPrice ? parseFloat(form.tripPrice) : undefined,
        actualCost: form.actualCost ? parseFloat(form.actualCost) : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Trip" : "Create New Trip"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trip Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Trip Date*"
            value={form.tripDate}
            onChange={(v) => setForm({ ...form, tripDate: v })}
            type="date"
          />
          <FormField
            label="Departure Time*"
            value={form.departureTime}
            onChange={(v) => setForm({ ...form, departureTime: v })}
            type="time"
          />
        </div>

        {/* Locations */}
        <FormField
          label="Pickup Location*"
          value={form.pickupLocation}
          onChange={(v) => setForm({ ...form, pickupLocation: v })}
          placeholder="e.g., Hotel Main Entrance"
        />
        <FormField
          label="Destination*"
          value={form.destination}
          onChange={(v) => setForm({ ...form, destination: v })}
          placeholder="e.g., Airport Terminal 1"
        />
        <FormField
          label="Dropoff Location"
          value={form.dropoffLocation}
          onChange={(v) => setForm({ ...form, dropoffLocation: v })}
          placeholder="e.g., City Center"
        />

        {/* Estimated Arrival */}
        <FormField
          label="Estimated Arrival Time"
          value={form.estimatedArrivalTime}
          onChange={(v) => setForm({ ...form, estimatedArrivalTime: v })}
          type="time"
        />

        {/* Agency & Hotel */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Agency*
          </label>
          <Select
            value={form.agencyId}
            onValueChange={(v) => setForm({ ...form, agencyId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select agency" />
            </SelectTrigger>
            <SelectContent>
              {agencies.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Hotel*</label>
          <Select
            value={form.hotelId}
            onValueChange={(v) => setForm({ ...form, hotelId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select hotel" />
            </SelectTrigger>
            <SelectContent>
              {hotels.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name} ({h.city})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Vehicle*
          </label>
          <Select
            value={form.vehicleId}
            onValueChange={(v) => setForm({ ...form, vehicleId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.plate} - {v.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Driver - Only show for non-drivers */}
        {!isDriver && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Assign Driver*
            </label>
            <Select
              value={form.driverId}
              onValueChange={(v) => setForm({ ...form, driverId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.user.name} ({d.user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Trip Type */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Trip Type*
          </label>
          <Select
            value={form.type}
            onValueChange={(v) => setForm({ ...form, type: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OUT">OUT (Hotel → Destination)</SelectItem>
              <SelectItem value="IN">IN (Destination → Hotel)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Passengers & KM */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Passengers*"
            value={form.passengersCount}
            onChange={(v) => setForm({ ...form, passengersCount: v })}
            type="number"
            placeholder="0"
          />
          <FormField
            label="Start KM*"
            value={form.kmStart}
            onChange={(v) => setForm({ ...form, kmStart: v })}
            type="number"
            placeholder="0"
          />
        </div>

        {/* End KM & Distance */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="End KM"
            value={form.kmEnd}
            onChange={(v) => setForm({ ...form, kmEnd: v })}
            type="number"
            placeholder="0"
          />
          <FormField
            label="Distance Travelled"
            value={form.distanceTravelled}
            onChange={(v) => setForm({ ...form, distanceTravelled: v })}
            type="number"
            placeholder="0"
          />
        </div>

        {/* Status - Only for admin/manager */}
        {!isDriver && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Status
            </label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pricing - Only for admin/manager */}
        {!isDriver && (
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Trip Price"
              value={form.tripPrice}
              onChange={(v) => setForm({ ...form, tripPrice: v })}
              type="number"
              placeholder="0.00"
            />
            <FormField
              label="Actual Cost"
              value={form.actualCost}
              onChange={(v) => setForm({ ...form, actualCost: v })}
              type="number"
              placeholder="0.00"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Notes</label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Add any notes about this trip..."
            rows={3}
          />
        </div>

        {/* Footer */}
        <div className="border-t -mx-6 px-6 py-4 mt-6 flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Saving..." : "Save Trip"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
