import { createHash } from "crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `57${digits}`; // asume número colombiano sin indicativo
  return digits;
}