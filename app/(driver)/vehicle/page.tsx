import { getCurrentSession } from "@/lib/auth/guards";

export const metadata = {
  title: "My Vehicle - TransitHub",
  description: "View your assigned vehicle details",
};

export default async function DriverVehiclePage() {
  const session = await getCurrentSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Vehicle</h1>
        <p className="text-gray-600 mt-1">View your assigned vehicle details and maintenance schedule</p>
      </div>

      {/* Placeholder - To be implemented */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Vehicle information will be displayed here</p>
      </div>
    </div>
  );
}
