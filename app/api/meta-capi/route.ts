import { NextResponse } from "next/server";
import { sha256, normalizePhone } from "@/lib/metaHash";

const PIXEL_ID = "1035127014079737";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

interface UserDataInput {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  fbp?: string;
  fbc?: string;
}

export async function POST(req: Request) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: "Falta META_CAPI_ACCESS_TOKEN" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      event_name,
      event_id,
      event_source_url,
      custom_data,
      user_data,
    }: {
      event_name: string;
      event_id: string;
      event_source_url?: string;
      custom_data?: Record<string, unknown>;
      user_data?: UserDataInput;
    } = body;

    if (!event_name || !event_id) {
      return NextResponse.json({ error: "Faltan event_name o event_id" }, { status: 400 });
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp =
      forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
    const userAgent = req.headers.get("user-agent") || "";

    const hashedUserData: Record<string, unknown> = {};

    if (user_data?.email) hashedUserData.em = [sha256(user_data.email)];
    if (user_data?.phone) hashedUserData.ph = [sha256(normalizePhone(user_data.phone))];
    if (user_data?.firstName) hashedUserData.fn = [sha256(user_data.firstName)];
    if (user_data?.lastName) hashedUserData.ln = [sha256(user_data.lastName)];
    if (user_data?.city) hashedUserData.ct = [sha256(user_data.city)];
    if (user_data?.country) hashedUserData.country = [sha256(user_data.country)];
    if (user_data?.fbp) hashedUserData.fbp = user_data.fbp;
    if (user_data?.fbc) hashedUserData.fbc = user_data.fbc;
    if (clientIp) hashedUserData.client_ip_address = clientIp;
    if (userAgent) hashedUserData.client_user_agent = userAgent;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url,
          action_source: "website",
          user_data: hashedUserData,
          custom_data: custom_data || {},
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Meta CAPI error:", data);
      return NextResponse.json({ ok: false, error: data }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("Meta CAPI exception:", err);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}