import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const pedido = await prisma.pedido.findUnique({ where: { id } });
  if (!pedido) {
    return NextResponse.json({ ok: true });
  }
  if (pedido.estadoPago === "PAGADO") {
    return NextResponse.json(
      { error: "No se puede borrar un pedido ya pagado" },
      { status: 400 },
    );
  }

  await prisma.pedido.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}