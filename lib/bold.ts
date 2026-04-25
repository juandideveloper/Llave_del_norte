export async function generarIntegrityBold(orderId: string, amount: number) {
  const secretKey = process.env.BOLD_SECRET_KEY!
  const currency = "COP"
  
  // Bold Colombia usa el monto en pesos (no centavos)
  const concatenado = `${orderId}${Math.round(amount)}${currency}${secretKey}`
  
  const encoder = new TextEncoder()
  const data = encoder.encode(concatenado)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  
  return hash
}