import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticationService } from "./auth/services/auth.service";
import { userRepository } from "./auth/repositories/user.repository";
import { UserRole } from "@prisma/client";

/**
 * NextAuth Configuration
 * Handles session management, JWT tokens, and authentication flow
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await authenticationService.authenticateUser(
            credentials.email as string,
            credentials.password as string,
          );

          return {
            id: user.userId,
            email: user.email,
            role: user.role,
            name: user.name,
            phone: user.phone,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  callbacks: {
    /**
     * JWT Callback
     * Called whenever JWT is created or updated
     */
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role;
        token.name = (user as any).name;
        token.phone = (user as any).phone;
      }

      // Refresh user data from database
      if (trigger === "update" && token.id) {
        try {
          const dbUser = await userRepository.findUserById(token.id as string);
          if (dbUser) {
            token.role = dbUser.role;
            token.name = dbUser.name;
            token.phone = dbUser.phone;
            token.status = dbUser.status;
          }
        } catch (error) {
          console.error("Error refreshing user data in JWT callback:", error);
        }
      }

      return token;
    },

    /**
     * Session Callback
     * Called whenever session is checked
     * Adds token data to session object
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as string;
        session.user.phone = token.phone as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`[Auth] User signed in: ${user.email}`);
    },

    async signOut({ token }: any) {
      console.log(`[Auth] User signed out: ${token?.email}`);
    },
  },

  debug: process.env.NODE_ENV === "development",
});
