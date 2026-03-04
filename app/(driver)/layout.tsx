import { ensureDriver } from "@/lib/auth/guards";
import { DashboardLayout } from "@/components/DashboardLayout";

export const metadata = {
  title: "Driver Portal - TransitHub",
  description: "Driver dashboard and trip management",
};

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure only drivers can access this route group
  await ensureDriver();

  return <DashboardLayout>{children}</DashboardLayout>;
}
