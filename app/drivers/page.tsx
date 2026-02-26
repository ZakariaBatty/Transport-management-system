import { DriversContainer } from "@/components/driver/DriversContainer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Drivers - TransitHub",
  description: "Manage and monitor drivers",
};

export default async function DriversPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Only authenticated users can access drivers
  return <DriversContainer />;
}
