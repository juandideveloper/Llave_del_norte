import { createHmac, timingSafeEqual } from "crypto";

export async function generarIntegrityBold(orderId: string, amount: number) {
  const secretKey = process.env.BOLD_SECRET_KEY!
  const currency = "COP"
  
  const concatenado = `${orderId}${Math.round(amount)}${currency}${secretKey}`
  
  const encoder = new TextEncoder()
  const data = encoder.encode(concatenado)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  
  return hash
}

export function verificarFirmaBold(rawBody: string, signature: string): boolean {
  const secretKey = process.env.BOLD_SECRET_KEY!;
  const encoded = Buffer.from(rawBody, "utf-8").toString("base64");
  const hashed = createHmac("sha256", secretKey).update(encoded).digest("hex");

  const a = Buffer.from(hashed);
  const b = Buffer.from(signature);

  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}