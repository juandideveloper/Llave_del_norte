import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { estado } = body

    const importacion = await prisma.importacion.update({
      where: { id: Number(id) },
      data: { estado }
    })

    return NextResponse.json({ ok: true, importacion })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}