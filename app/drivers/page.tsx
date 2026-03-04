import { ensureManager } from "@/lib/auth/guards";
import { DriversContainer } from "@/components/driver/DriversContainer";

export const metadata = {
  title: "Drivers - TransitHub",
  description: "Manage and monitor drivers",
};

export default async function DriversPage() {
  // Ensure user is authenticated and has manager role or higher
  await ensureManager();

  return <DriversContainer />;
}
