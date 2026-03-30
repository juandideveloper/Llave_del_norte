import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import crypto from "crypto";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "El email es requerido" },
        { status: 400 },
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (!cliente) {
      return NextResponse.json({
        mensaje: "Si el email existe, se enviara un correo",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpira = new Date(Date.now() + 300000);

    await prisma.cliente.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpira: tokenExpira,
      },
    });

    await resend.emails.send({
      from: "La llave del norte <onboarding@resend.dev>",
      to: "juandiegoriosrojasdeveloper@gmail.com",
      subject: "Recuperar contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #112221">Recuperar contraseña</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <a href="${process.env.NEXTAUTH_URL}/nueva-password?token=${token}"
            style="background-color: #112221; color: #e1b86b; padding: 12px 24px;
            text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
            Restablecer contraseña
          </a>
          <p style="color: #999; font-size: 12px;">
            Este enlace expira en 5 minutos. Si no solicitaste esto ignora este correo.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      mensaje: "Si el email existe, se enviara un correo",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}
