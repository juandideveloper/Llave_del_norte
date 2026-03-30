import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/extension";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Esta función registra clientes importadores
// La diferencia es que quedan PENDIENTE hasta que el admin los apruebe

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      email,
      password,
      telefono,
      empresa,
      nit,
      tipoCliente,
      volumenEstimado,
    } = body;

    if (!nombre || !email || !password || !empresa || !nit) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 },
      );
    }

    const clienteExiste = await prisma.cliente.findUnique({
      where: { email },
    });

    if (clienteExiste) {
      return NextResponse.json(
        { error: " El cliente con este email ya existe " },
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
        empresa,
        nit,
        tipoCliente,
        volumenEstimado,
        rol: "ESPECIAL",
        estado: "PENDIENTE",
      },
    });

    return (
      NextResponse.json({
        id: nuevoCliente.id,
        nombre: nuevoCliente.nombre,
        email: nuevoCliente.email,
        estado: nuevoCliente.estado,
      })
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar el cliente importador" },

      { status: 500 },
    );
  }
}
