import { ensureDriver } from "@/lib/auth/guards";
import { DriverDashboard } from "@/components/driver-dashboard/DriverDashboard";

export const metadata = {
  title: "My Dashboard - TransitHub",
  description: "Your driver dashboard and trip overview",
};

export default async function DriverDashboardPage() {
  // Ensure user is authenticated and has driver role
  await ensureDriver();

  return <DriverDashboard />;
}
