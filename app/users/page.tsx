import { UsersContainer } from "@/components/user/UsersContainer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Users - TransitHub",
  description: "Manage team members and access permissions",
};

export default async function UsersPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Only admin and super admin can access users page
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // Render the client component
  return <UsersContainer />;
}
