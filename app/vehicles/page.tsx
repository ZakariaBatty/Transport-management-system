import { ensureManager } from "@/lib/auth/guards";
import { VehiclesContainer } from "@/components/vehicles/VehiclesContainer";

export const metadata = {
  title: "Vehicles - TransitHub",
  description: "Manage and monitor your fleet",
};

export default async function VehiclesPage() {
  // Ensure user is authenticated and has manager role or higher
  await ensureManager();

  return <VehiclesContainer />;
}
