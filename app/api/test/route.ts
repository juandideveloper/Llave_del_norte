import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ status: "Conectado a la base de datos" })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}