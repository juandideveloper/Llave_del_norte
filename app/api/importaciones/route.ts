import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, proveedor, estado, fechaEstimada, paisOrigen, numeroContenedor, notas, pedidosIds } = body

    if (!nombre || !proveedor) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const importacion = await prisma.importacion.create({
      data: {
        nombre,
        proveedor,
        estado: estado || "CONFIRMADO",
        paisOrigen: paisOrigen || null,
        numeroContenedor: numeroContenedor || null,
        notas: notas || null,
        fechaEstimada: fechaEstimada ? new Date(fechaEstimada) : null,
        ...(pedidosIds && pedidosIds.length > 0 && {
          pedidos: {
            connect: pedidosIds.map((id: number) => ({ id }))
          }
        })
      }
    })

    return NextResponse.json({ ok: true, importacion })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al crear importación" }, { status: 500 })
  }
}