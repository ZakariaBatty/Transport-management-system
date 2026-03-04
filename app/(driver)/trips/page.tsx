import { getCurrentSession } from "@/lib/auth/guards";
import { TripsContainer } from "@/components/trips/TripsContainer";

export const metadata = {
  title: "My Trips - TransitHub",
  description: "View and manage your assigned trips",
};

export default async function DriverTripsPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
        <p className="text-gray-600 mt-1">View and manage your assigned trips</p>
      </div>

      <TripsContainer />
    </div>
  );
}
