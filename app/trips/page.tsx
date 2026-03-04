import { ensureManager } from "@/lib/auth/guards";
import { TripsContainer } from "@/components/trips/TripsContainer";

export const metadata = {
  title: "Trips - TransitHub",
  description: "Manage and monitor transportation trips",
};

export default async function TripsPage() {
  // Ensure user is authenticated and has manager role or higher
  await ensureManager();

  return <TripsContainer />;
}
