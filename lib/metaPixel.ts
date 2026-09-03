import { getMetaCookies } from "./metaCookies";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

interface MetaUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}

export function sendMetaEvent(
  eventName: string,
  customData?: Record<string, unknown>,
  userData?: MetaUserData,
) {
  if (typeof window === "undefined") return;

  const eventId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Evento por navegador (Pixel), con el mismo eventID para que Meta deduplique
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, customData, { eventID: eventId });
  }

  // Evento por servidor (API de Conversiones)
  const { fbp, fbc } = getMetaCookies();

  fetch("/api/meta-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: customData,
      user_data: { ...userData, fbp, fbc },
    }),
  }).catch(() => {});
}