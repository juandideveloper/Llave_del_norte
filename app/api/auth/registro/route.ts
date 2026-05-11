import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { emailBienvenida } from "@/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, password, telefono } = body;

    if (!nombre || !email || !password || !telefono) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const clienteExiste = await prisma.cliente.findUnique({ where: { email } });
    if (clienteExiste) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 400 },
      );
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);
    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombre,
        email,
        password: passwordEncriptada,
        telefono,
        rol: "NORMAL",
        estado: "APROBADO",
      },
    });

    // Email de bienvenida
    await resend.emails.send({
      from: "La Llave del Norte <noreply@lallavedelnorte.com>",
      to: email,
      subject: "¡Bienvenido a La Llave del Norte!",
      html: emailBienvenida(nombre),
    }).catch(() => {}) // No fallar si el email falla

    return NextResponse.json({
      id: nuevoCliente.id,
      nombre: nuevoCliente.nombre,
      email: nuevoCliente.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear la cuenta" },
      { status: 500 },
    );
  }
}