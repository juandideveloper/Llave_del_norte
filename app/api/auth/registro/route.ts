import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Esta función se ejecuta cuando alguien envía el formulario de registro
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
    const clienteExiste = await prisma.cliente.findUnique({
      where: { email },
    });

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
