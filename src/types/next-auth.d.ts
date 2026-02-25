import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      phone?: string;
      status?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    phone?: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    phone?: string;
    status?: string;
  }
}
