import { getCurrentSession } from "@/lib/auth/guards";

export const metadata = {
  title: "Calendar - TransitHub",
  description: "View your trip schedule and calendar",
};

export default async function DriverCalendarPage() {
  const session = await getCurrentSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600 mt-1">View your trips and schedule in calendar view</p>
      </div>

      {/* Placeholder - To be implemented */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Calendar will be displayed here</p>
      </div>
    </div>
  );
}
