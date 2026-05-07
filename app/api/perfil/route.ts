import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(session.user.id) },
      select: {
        nombre: true,
        email: true,
        telefono: true,
        direccion: true,
        ciudad: true,
        barrio: true,
        rol: true,
        estado: true,
        empresa: true,
        nit: true,
      }
    })

    return NextResponse.json({ cliente })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const { nombre, telefono, direccion, ciudad, barrio } = body

    await prisma.cliente.update({
      where: { id: Number(session.user.id) },
      data: {
        nombre: nombre || undefined,
        telefono: telefono || undefined,
        direccion: direccion || undefined,
        ciudad: ciudad || undefined,
        barrio: barrio || undefined,
      }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 })
  }
}