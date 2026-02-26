"use client";

import { Building2, Hotel, Edit2, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface LocationsListProps {
  type: "agencies" | "hotels";
  items: Agency[] | Hotel[];
  userRole: string;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export function LocationsList({
  type,
  items,
  userRole,
  onView,
  onEdit,
  onDelete,
}: LocationsListProps) {
  const isAgencies = type === "agencies";
  const canEdit = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

  return (
    <div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isAgencies ? (item as Agency).name : (item as Hotel).name}
                  </h3>
                  {isAgencies ? (
                    <Building2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Hotel className="w-5 h-5 text-orange-600" />
                  )}
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  {isAgencies ? (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Contact:</span>{" "}
                        {(item as Agency).contactPerson}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span>{" "}
                        {(item as Agency).phone}
                      </p>
                      {(item as Agency).email && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{" "}
                          {(item as Agency).email}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">City:</span>{" "}
                        {(item as Hotel).city}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Address:</span>{" "}
                        {(item as Hotel).address}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span>{" "}
                        {(item as Hotel).phone}
                      </p>
                    </>
                  )}
                </div>

                <div
                  className={`grid ${isAgencies ? "grid-cols-3" : "grid-cols-2"} gap-3 mb-4`}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {item.totalTrips}
                    </p>
                    <p className="text-xs text-gray-600">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {item.totalPassengers}
                    </p>
                    <p className="text-xs text-gray-600">Passengers</p>
                  </div>
                  {isAgencies && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        ${(item as Agency).totalRevenue}
                      </p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onView?.(item)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => onEdit?.(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete?.(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              No {isAgencies ? "agencies" : "hotels"} found.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
