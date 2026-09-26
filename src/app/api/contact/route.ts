import { contactSchema } from "@/lib/validation";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 16 * 1024;

// Best-effort in-memory rate limit (per server instance). Use a shared store
// such as Upstash/Redis if deployed across many instances.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many enquiries. Please try again in a few minutes." }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Message is too large." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
    return Response.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const data = parsed.data;
  // Honeypot filled → silently accept, never deliver.
  if (data.website) return Response.json({ ok: true });

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] delivery not configured — enquiry received (dev only):", { ...data, message: `${data.message.slice(0, 80)}…` });
      return Response.json({ ok: true, delivered: false });
    }
    console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL are not set");
    return Response.json({ ok: false, error: "Enquiries are temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const rows: [string, string | undefined][] = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Project type", data.projectType],
    ["Budget", data.budget],
  ];
  const html = `
    <h2>New project enquiry — WOLVO website</h2>
    <table cellpadding="6">${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v!)}</td></tr>`)
      .join("")}</table>
    <p><strong>Message</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: `Project enquiry: ${data.projectType} — ${data.name}`.slice(0, 200),
      html,
    }),
  });

  if (!res.ok) {
    console.error("[contact] delivery failed", res.status, await res.text().catch(() => ""));
    return Response.json({ ok: false, error: "We couldn't send your enquiry. Please try again shortly." }, { status: 502 });
  }
  return Response.json({ ok: true, delivered: true });
}
