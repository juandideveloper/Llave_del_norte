import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`https://api-colombia.com/api/v1/Department/${id}/cities`)
  const data = await res.json()
  return NextResponse.json(data)
}