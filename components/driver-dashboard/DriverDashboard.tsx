"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Truck,
  MapPin,
  DollarSign,
  Activity,
  Clock,
  Star,
} from "lucide-react";
import useSWR from "swr";
import { getDriverKPIs } from "@/lib/driver-dashboard/actions/driver-dashboard.actions";

interface DriverKPIData {
  driverName?: string;
  driverRating: number;
  averageRating: number;
  totalTripsCompleted: number;
  totalTrips: number;
  todayTripsCompleted: number;
  todayTrips: number;
  totalDistance: number;
  totalEarnings: number;
  assignedVehicle: string;
}

export function DriverDashboard() {
  const [kpiData, setKpiData] = useState<DriverKPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const result = await getDriverKPIs();
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
        <p className="text-gray-500">Loading your dashboard...</p>
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
      title: "Today's Trips",
      value: kpiData?.todayTrips || 0,
      icon: Activity,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Completed Today",
      value: kpiData?.todayTripsCompleted || 0,
      icon: Clock,
      color: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-l-green-500",
    },
    {
      title: "Your Vehicle",
      value: kpiData?.assignedVehicle || "Unassigned",
      icon: Truck,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      borderColor: "border-l-purple-500",
      isText: true,
    },
    {
      title: "Your Rating",
      value: kpiData?.driverRating?.toFixed(1) || "N/A",
      icon: Star,
      color: "bg-yellow-100",
      textColor: "text-yellow-600",
      borderColor: "border-l-yellow-500",
    },
    {
      title: "Total Distance",
      value: `${Math.round(kpiData?.totalDistance || 0)} km`,
      icon: MapPin,
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      borderColor: "border-l-indigo-500",
    },
    {
      title: "Total Earnings",
      value: `$${(kpiData?.totalEarnings || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-l-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, {kpiData?.driverName || "Driver"}! Here's your performance overview
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
                  <p
                    className={`${stat.isText ? "text-lg" : "text-2xl"} font-bold ${stat.textColor} mt-1`}
                  >
                    {stat.value}
                  </p>
                </div>
                <Icon className={`${stat.textColor} w-8 h-8 opacity-50`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Trips Completed:</span>
              <span className="font-semibold">{kpiData?.totalTripsCompleted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="font-semibold text-green-600">
                {kpiData?.totalTrips && kpiData.totalTrips > 0
                  ? (
                      ((kpiData.totalTripsCompleted || 0) /
                        (kpiData.totalTrips || 1)) *
                      100
                    ).toFixed(1)
                  : "0"}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating:</span>
              <span className="font-semibold">
                {kpiData?.averageRating?.toFixed(1) || "N/A"} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Earnings Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Earnings:</span>
              <span className="font-semibold text-green-600">
                ${(kpiData?.totalEarnings || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Distance Traveled:</span>
              <span className="font-semibold">
                {Math.round(kpiData?.totalDistance || 0)} km
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Earnings per Trip:</span>
              <span className="font-semibold">
                $
                {kpiData?.totalTripsCompleted && kpiData.totalTripsCompleted > 0
                  ? ((kpiData.totalEarnings || 0) / kpiData.totalTripsCompleted).toFixed(
                      2,
                    )
                  : "0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href="/driver/trips"
            className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-center text-sm font-medium text-blue-700"
          >
            View Trips
          </a>
          <a
            href="/driver/vehicle"
            className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center text-sm font-medium text-purple-700"
          >
            My Vehicle
          </a>
          <a
            href="/driver/calendar"
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-center text-sm font-medium text-indigo-700"
          >
            Schedule
          </a>
          <a
            href="/profile"
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-center text-sm font-medium text-gray-700"
          >
            Profile
          </a>
        </div>
      </div>
    </div>
  );
}
