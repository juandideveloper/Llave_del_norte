import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch("https://api-colombia.com/api/v1/Department")
  const data = await res.json()
  return NextResponse.json(data)
}