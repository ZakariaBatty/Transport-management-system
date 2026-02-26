"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LocationsHeader } from "./LocationsHeader";
import { LocationsList } from "./LocationsList";
import { LocationsFormDrawer } from "./LocationsFormDrawer";
import * as locationActions from "@/lib/locations/actions/location.actions";

interface Agency {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  totalTrips: number;
  totalPassengers: number;
  totalRevenue: number;
}

interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string | null;
  totalTrips: number;
  totalPassengers: number;
}

export function LocationsContainer() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "DRIVER";

  // State management
  const [activeTab, setActiveTab] = useState<"agencies" | "hotels">("agencies");
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [drawerType, setDrawerType] = useState<"agency" | "hotel">("agency");
  const [selectedItem, setSelectedItem] = useState<Agency | Hotel | null>(null);

  // Load data
  const loadAgencies = useCallback(async () => {
    try {
      const data = await locationActions.getAgencies();
      setAgencies(data);
    } catch (error) {
      console.error("[loadAgencies]", error);
    }
  }, []);

  const loadHotels = useCallback(async () => {
    try {
      const data = await locationActions.getHotels();
      setHotels(data);
    } catch (error) {
      console.error("[loadHotels]", error);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([loadAgencies(), loadHotels()]);
      setIsLoading(false);
    };
    load();
  }, [loadAgencies, loadHotels]);

  // Handlers
  const handleCreateAgency = () => {
    setDrawerType("agency");
    setDrawerMode("create");
    setSelectedItem(null);
    setDrawerOpen(true);
  };

  const handleCreateHotel = () => {
    setDrawerType("hotel");
    setDrawerMode("create");
    setSelectedItem(null);
    setDrawerOpen(true);
  };

  const handleViewAgency = (agency: Agency) => {
    setSelectedItem(agency);
    setDrawerType("agency");
    setDrawerMode("view");
    setDrawerOpen(true);
  };

  const handleViewHotel = (hotel: Hotel) => {
    setSelectedItem(hotel);
    setDrawerType("hotel");
    setDrawerMode("view");
    setDrawerOpen(true);
  };

  const handleEditAgency = (agency: Agency) => {
    setSelectedItem(agency);
    setDrawerType("agency");
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setSelectedItem(hotel);
    setDrawerType("hotel");
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDeleteAgency = async (agency: Agency) => {
    if (!confirm(`Delete ${agency.name}?`)) return;
    try {
      await locationActions.deleteAgency(agency.id);
      setAgencies(agencies.filter((a) => a.id !== agency.id));
    } catch (error) {
      console.error("[deleteAgency]", error);
      alert("Failed to delete agency");
    }
  };

  const handleDeleteHotel = async (hotel: Hotel) => {
    if (!confirm(`Delete ${hotel.name}?`)) return;
    try {
      await locationActions.deleteHotel(hotel.id);
      setHotels(hotels.filter((h) => h.id !== hotel.id));
    } catch (error) {
      console.error("[deleteHotel]", error);
      alert("Failed to delete hotel");
    }
  };

  const handleSubmitAgency = async (data: Agency) => {
    setIsSubmitting(true);
    try {
      if (drawerMode === "create") {
        const created = await locationActions.createAgency({
          name: data.name,
          contactPerson: data.contactPerson,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
        });
        setAgencies([...agencies, created]);
      } else {
        const updated = await locationActions.updateAgency(data.id!, {
          name: data.name,
          contactPerson: data.contactPerson,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
        });
        setAgencies(agencies.map((a) => (a.id === data.id ? updated : a)));
      }
      setDrawerOpen(false);
    } catch (error) {
      console.error("[submitAgency]", error);
      alert("Failed to save agency");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitHotel = async (data: Hotel) => {
    setIsSubmitting(true);
    try {
      if (drawerMode === "create") {
        const created = await locationActions.createHotel({
          name: data.name,
          address: data.address,
          city: data.city,
          phone: data.phone,
          email: data.email,
        });
        setHotels([...hotels, created]);
      } else {
        const updated = await locationActions.updateHotel(data.id!, {
          name: data.name,
          address: data.address,
          city: data.city,
          phone: data.phone,
          email: data.email,
        });
        setHotels(hotels.map((h) => (h.id === data.id ? updated : h)));
      }
      setDrawerOpen(false);
    } catch (error) {
      console.error("[submitHotel]", error);
      alert("Failed to save hotel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    agencies: { total: agencies.length, active: agencies.length },
    hotels: { total: hotels.length, active: hotels.length },
  };

  return (
    <div className="space-y-6">
      <LocationsHeader
        activeTab={activeTab}
        onAddAgency={handleCreateAgency}
        onAddHotel={handleCreateHotel}
        stats={stats}
      />

      {/* Tabs */}
      <div className="flex gap-0 bg-white rounded-lg border border-gray-200 p-1">
        <button
          onClick={() => setActiveTab("agencies")}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === "agencies"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Agencies
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === "hotels"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Hotels
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "agencies" ? (
          <LocationsList
            type="agencies"
            items={agencies}
            userRole={userRole}
            onView={handleViewAgency}
            onEdit={handleEditAgency}
            onDelete={handleDeleteAgency}
          />
        ) : (
          <LocationsList
            type="hotels"
            items={hotels}
            userRole={userRole}
            onView={handleViewHotel}
            onEdit={handleEditHotel}
            onDelete={handleDeleteHotel}
          />
        )}
      </div>

      {/* Drawer */}
      <LocationsFormDrawer
        type={drawerType}
        mode={drawerMode}
        item={selectedItem as any}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={
          drawerType === "agency" ? handleSubmitAgency : handleSubmitHotel
        }
        isLoading={isSubmitting}
      />
    </div>
  );
}
