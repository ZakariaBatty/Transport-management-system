import NextAuth from "next-auth";

export const { auth } = NextAuth({
  // Minimum config - must include providers for type compatibility
  providers: [],
  // no adapters, no heavy dependencies
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});

export default auth;
