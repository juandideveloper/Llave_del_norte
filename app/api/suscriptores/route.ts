import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 })

    const existe = await prisma.suscriptor.findUnique({ where: { email } })
    if (existe) return NextResponse.json({ ok: true }) // Ya suscrito, no error

    await prisma.suscriptor.create({ data: { email } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al suscribirse" }, { status: 500 })
  }
}