import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Main Dashboard Router Page
 * Routes users based on their role:
 * - DRIVER → /driver/dashboard
 * - MANAGER/ADMIN/SUPER_ADMIN → /dashboard (global admin dashboard)
 */
export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Route based on user role
  if (session.user.role === "DRIVER") {
    redirect("/driver/dashboard");
  }

  // All admin roles go to global dashboard
  redirect("/dashboard");
}
