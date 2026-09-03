import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const cliente = await prisma.cliente.findUnique({
            where: { email: credentials.email },
          })

          if (!cliente) return null

          const passwordCorrecta = await bcrypt.compare(credentials.password, cliente.password)
          if (!passwordCorrecta) return null

          return {
            id: String(cliente.id),
            email: cliente.email,
            name: cliente.nombre,
            role: cliente.rol,
            estado: cliente.estado,
          }
        } catch (error) {
          console.error("Error en authorize:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.estado = user.estado
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.estado = token.estado as string
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
}