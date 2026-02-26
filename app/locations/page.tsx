import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LocationsContainer } from "@/components/locations/LocationsContainer";

export const metadata = {
  title: "Locations - TransitHub",
  description: "Manage agencies and hotels",
};

export default async function LocationsPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Only authenticated users can access locations
  return <LocationsContainer />;
}
