import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { use } from "react";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    // Le decimos a NextAuth que usamos email y contraseña
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      // Esta función verifica si el usuario existe y la contraseña es correcta
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Buscamos el cliente en la base de datos por email
        const cliente = await prisma.cliente.findUnique({
          where: { email: credentials.email },
        });

        // Si no existe el cliente retornamos null (login fallido)
        if (!cliente) return null;

        // Comparamos la contraseña ingresada con la encriptada en la BD
        const passwordCorrecta = await bcrypt.compare(
          credentials.password,
          cliente.password,
        );

        // Si la contraseña es incorrecta retornamos null
        if (!passwordCorrecta) return null;

        // Si todo está bien retornamos los datos del cliente
        return {
          id: String(cliente.id),
          email: cliente.email,
          name: cliente.nombre,
          role: cliente.rol,
          estado: cliente.estado,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.estado = user.estado;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.estado = token.estado as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
