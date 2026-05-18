import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const asunto = formData.get("asunto") as string
    const mensaje = formData.get("mensaje") as string
    const archivo = formData.get("archivo") as File | null
    const modo = formData.get("modo") as string || "global"
    const emailDestino = formData.get("emailDestino") as string | null
    const esHtml = formData.get("esHtml") === "true"

    if (!asunto || !mensaje) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Preparar adjunto si existe
    let attachments: { filename: string; content: Buffer }[] = []
    if (archivo && archivo.size > 0) {
      const bytes = await archivo.arrayBuffer()
      attachments = [{
        filename: archivo.name,
        content: Buffer.from(bytes),
      }]
    }

    // Procesar imágenes base64 del editor — convertirlas en adjuntos inline
    let cuerpoHtml = esHtml ? mensaje : mensaje.replace(/\n/g, "<br/>")
    const imgRegex = /<img[^>]+src="data:([^;]+);base64,([^"]+)"[^>]*>/g
    let match
    let cid = 0
    const inlineAttachments: { filename: string; content: Buffer; cid: string }[] = []

    while ((match = imgRegex.exec(mensaje)) !== null) {
      const mimeType = match[1]
      const base64Data = match[2]
      const ext = mimeType.split("/")[1] || "png"
      const cidStr = `imagen${cid}@boletin`
      inlineAttachments.push({
        filename: `imagen${cid}.${ext}`,
        content: Buffer.from(base64Data, "base64"),
        cid: cidStr,
      })
      cuerpoHtml = cuerpoHtml.replace(
        match[0],
        `<img src="cid:${cidStr}" style="max-width:100%;border-radius:8px;margin:8px 0;"/>`
      )
      cid++
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #112221; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #e1b86b; margin: 0; font-size: 20px;">La Llave del Norte</h1>
        </div>
        <div style="background: #ffffff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0;">
          <div style="color: #112221; font-size: 14px; line-height: 1.6;">${cuerpoHtml}</div>
          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 24px 0;"/>
          <p style="color: #999; font-size: 11px;">
            Recibes este correo porque te suscribiste al newsletter de La Llave del Norte.
          </p>
        </div>
      </div>
    `

    const todosAdjuntos = [
      ...attachments,
      ...inlineAttachments,
    ]

    if (modo === "individual") {
      if (!emailDestino) {
        return NextResponse.json({ error: "Falta el email de destino" }, { status: 400 })
      }
      await resend.emails.send({
        from: "La Llave del Norte <noreply@lallavedelnorte.com>",
        to: emailDestino,
        subject: asunto,
        html,
        attachments: todosAdjuntos,
      })
      return NextResponse.json({ ok: true })
    }

    const suscriptores = await prisma.suscriptor.findMany()
    if (suscriptores.length === 0) {
      return NextResponse.json({ error: "No hay suscriptores" }, { status: 400 })
    }

    await resend.emails.send({
      from: "La Llave del Norte <noreply@lallavedelnorte.com>",
      to: suscriptores.map(s => s.email),
      subject: asunto,
      html,
      attachments: todosAdjuntos,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error enviando boletín:", error)
    return NextResponse.json({ error: "Error al enviar el boletín" }, { status: 500 })
  }
}