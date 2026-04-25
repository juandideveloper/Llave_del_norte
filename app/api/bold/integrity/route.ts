import { NextRequest, NextResponse } from "next/server"
import { generarIntegrityBold } from "@/lib/bold"

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount } = await req.json()
    const hash = await generarIntegrityBold(orderId, amount)
    return NextResponse.json({ ok: true, hash })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}