import { ensureManager } from "@/lib/auth/guards";
import { GlobalDashboard } from "@/components/dashboard/GlobalDashboard";

export const metadata = {
  title: "Global Dashboard - TransitHub",
  description: "System overview and global operations metrics",
};

export default async function AdminDashboardPage() {
  // Ensure user is authenticated and has manager role or higher
  await ensureManager();

  return <GlobalDashboard />;
}
