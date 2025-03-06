// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email en wachtwoord zijn vereist");
        }
        
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) throw new Error("Geen gebruiker gevonden");
        
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) throw new Error("Ongeldig wachtwoord");
        
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { id: token.id },
        select: { roleId: true, firstName: true },
      });

      session.user.roleId = user?.roleId || 0;
      session.user.firstName = user?.firstName || "Gast";
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
  pages: {
    signIn: "/auth/login", // Loginpagina
    redirect: "/dashboard", // Redirect na succesvolle login
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
