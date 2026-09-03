import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verificarFirmaBold } from "@/lib/bold";

export async function POST(req: Request) {
  const signature = req.headers.get("x-bold-signature") || "";
  const rawBody = await req.text();

  if (!verificarFirmaBold(rawBody, signature)) {
    console.error("Firma de Bold inválida");
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { type, data } = payload;
  const referencia = data?.metadata?.reference;

  if (!referencia) {
    return NextResponse.json({ ok: true });
  }

  const pedidoId = Number(referencia);
  if (isNaN(pedidoId)) {
    return NextResponse.json({ ok: true });
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: { cliente: { select: { nombre: true, email: true } } },
  });

  if (!pedido) {
    console.error(`Webhook Bold: pedido ${pedidoId} no encontrado`);
    return NextResponse.json({ ok: true });
  }

  if (pedido.estadoPago === "PAGADO" && type === "SALE_APPROVED") {
    return NextResponse.json({ ok: true });
  }

  if (type === "SALE_APPROVED") {
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: { estadoPago: "PAGADO" },
    });

    const items = pedido.productosJson ? JSON.parse(pedido.productosJson) : [];

    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/confirmacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pedidoId: pedido.id,
        email: pedido.cliente.email,
        nombre: pedido.cliente.nombre,
        total: pedido.total,
        direccion: pedido.direccionEntrega,
        items,
      }),
    }).catch(() => {});
  } else if (type === "SALE_REJECTED") {
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: { estadoPago: "FALLIDO" },
    });
  }

  return NextResponse.json({ ok: true });
}