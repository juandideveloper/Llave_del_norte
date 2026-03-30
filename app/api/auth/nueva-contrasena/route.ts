import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token y contraseña son requeridos " },
        { status: 400 },
      );
    }

    const cliente = await prisma.cliente.findFirst({
      where: {
        resetToken: token,
        resetTokenExpira: { gt: new Date() },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "El enlace no es válido o ha expirado" },
        { status: 400 },
      );
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    await prisma.cliente.update({
      where: { id: cliente.id },
      data: {
        password: passwordEncriptada,
        resetToken: null,
        resetTokenExpira: null,
      },
    });

    return NextResponse.json({
      mensaje: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar la contraseña" },
      { status: 500 },
    );
  }
}
