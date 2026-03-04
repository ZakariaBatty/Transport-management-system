import { ensureAdmin } from "@/lib/auth/guards";
import { UsersContainer } from "@/components/user/UsersContainer";

export const metadata = {
  title: "Users - TransitHub",
  description: "Manage team members and access permissions",
};

export default async function UsersPage() {
  // Ensure user is authenticated and has admin role or higher
  await ensureAdmin();

  return <UsersContainer />;
}
