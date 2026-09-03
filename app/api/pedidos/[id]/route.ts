import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    select: {
      id: true,
      estadoPago: true,
      total: true,
      direccionEntrega: true,
      ciudadEntrega: true,
      fechaPedido: true,
    },
  });

  if (!pedido) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ pedido });
}