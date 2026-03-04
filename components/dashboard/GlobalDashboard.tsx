"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Users, Truck, MapPin, DollarSign, Activity } from "lucide-react";
import useSWR from "swr";
import { getGlobalDashboardKPIs } from "@/lib/global-dashboard/actions/global-dashboard.actions";

interface KPIData {
  totalUsers: number;
  totalActiveDrivers: number;
  totalVehicles: number;
  availableVehicles: number;
  activeTrips: number;
  totalTripsCompleted: number;
  totalTripsToday: number;
  todayRevenue: number;
  averageTripPrice: number;
  totalDistanceToday: number;
}

export function GlobalDashboard() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const result = await getGlobalDashboardKPIs();
        if (result.success) {
          setKpiData(result.data);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Trips Today",
      value: kpiData?.totalTripsToday || 0,
      icon: Activity,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Active Drivers",
      value: kpiData?.totalActiveDrivers || 0,
      icon: Users,
      color: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-l-green-500",
    },
    {
      title: "Vehicles In Use",
      value: kpiData?.totalVehicles || 0,
      icon: Truck,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      borderColor: "border-l-purple-500",
    },
    {
      title: "Active Trips",
      value: kpiData?.activeTrips || 0,
      icon: MapPin,
      color: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-l-orange-500",
    },
    {
      title: "Total Distance Today",
      value: `${Math.round(kpiData?.totalDistanceToday || 0)} km`,
      icon: TrendingUp,
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      borderColor: "border-l-indigo-500",
    },
    {
      title: "Today's Revenue",
      value: `$${(kpiData?.todayRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-l-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time system overview and operations metrics
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`${stat.color} ${stat.borderColor} border-l-4 rounded-lg p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`${stat.textColor} w-8 h-8 opacity-50`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Metrics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Revenue:</span>
              <span className="font-semibold text-green-600">
                ${(kpiData?.todayRevenue || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Trip Price:</span>
              <span className="font-semibold">
                ${(kpiData?.averageTripPrice || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trips Completed Today:</span>
              <span className="font-semibold">{kpiData?.totalTripsCompleted || 0}</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users:</span>
              <span className="font-semibold">{kpiData?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Vehicles:</span>
              <span className="font-semibold">
                {kpiData?.availableVehicles || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Uptime:</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
