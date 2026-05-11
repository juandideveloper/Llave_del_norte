import { NextResponse } from "next/server"
import { Resend } from "resend"
import { emailConfirmacionCompra } from "@/lib/emails"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { pedidoId, email, nombre, total, direccion, items } = await req.json()

    await resend.emails.send({
      from: "La Llave del Norte <noreply@lallavedelnorte.com>",
      to: email,
      subject: `Pedido #${String(pedidoId).padStart(5, "0")} confirmado`,
      html: emailConfirmacionCompra(
        nombre,
        String(pedidoId).padStart(5, "0"),
        total,
        direccion,
        items
      ),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 })
  }
}