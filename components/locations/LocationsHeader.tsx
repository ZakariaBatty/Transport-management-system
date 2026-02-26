import { Truck, Building2, Hotel, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared";

interface LocationsHeaderProps {
  activeTab: "agencies" | "hotels";
  onAddAgency?: () => void;
  onAddHotel?: () => void;
  stats?: {
    agencies: { total: number; active: number };
    hotels: { total: number; active: number };
  };
}

export function LocationsHeader({
  activeTab,
  onAddAgency,
  onAddHotel,
  stats,
}: LocationsHeaderProps) {
  const isAgencies = activeTab === "agencies";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations Management"
        subtitle="Manage agencies and hotels"
        actions={
          <Button size="sm" onClick={isAgencies ? onAddAgency : onAddHotel}>
            <Plus className="w-4 h-4 mr-2" />
            Add {isAgencies ? "Agency" : "Hotel"}
          </Button>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          {isAgencies ? (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Agencies</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.agencies.total}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.agencies.active}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Hotel className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Hotels</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.hotels.total}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Hotel className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.hotels.active}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
