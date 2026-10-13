import { site } from '@/data/site';

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  timeline?: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
}

export type InquiryResult =
  | { ok: true; via: 'endpoint' | 'mailto' | 'spam' }
  | { ok: false; error: string };

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_PATTERN = /^[+()\d\s.-]{7,20}$/;

const LIMITS: Record<keyof InquiryInput, number> = {
  name: 80,
  email: 120,
  phone: 20,
  service: 60,
  budget: 40,
  timeline: 40,
  message: 2000,
  website: 200,
};

/** Trims, strips control characters and enforces length limits on every field. */
export function sanitizeInquiry(input: InquiryInput): InquiryInput {
  const clean = (value: string | undefined, max: number) =>
    // eslint-disable-next-line no-control-regex
    (value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

  return {
    name: clean(input.name, LIMITS.name),
    email: clean(input.email, LIMITS.email).toLowerCase(),
    phone: clean(input.phone, LIMITS.phone),
    service: clean(input.service, LIMITS.service),
    budget: clean(input.budget, LIMITS.budget),
    timeline: clean(input.timeline, LIMITS.timeline),
    message: clean(input.message, LIMITS.message),
    website: clean(input.website, LIMITS.website),
  };
}

export function buildMailto(input: InquiryInput, to: string = site.email): string {
  const lines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : '',
    `Service: ${input.service}`,
    input.budget ? `Budget: ${input.budget}` : '',
    input.timeline ? `Timeline: ${input.timeline}` : '',
    '',
    input.message,
  ].filter((line, i, arr) => line !== '' || arr[i - 1] !== '');
  const subject = `New project inquiry — ${input.service}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

const COOLDOWN_KEY = 'wolvo:last-inquiry';
const COOLDOWN_MS = 30_000;

function inCooldown(): boolean {
  try {
    const last = Number(sessionStorage.getItem(COOLDOWN_KEY));
    return Number.isFinite(last) && Date.now() - last < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markSent() {
  try {
    sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Sends the inquiry to the configured endpoint (VITE_CONTACT_ENDPOINT) as JSON,
 * or falls back to opening the visitor's email client with a prefilled message.
 */
export async function submitInquiry(raw: InquiryInput): Promise<InquiryResult> {
  const data = sanitizeInquiry(raw);

  // Bots fill hidden fields; pretend success without sending anything.
  if (data.website) return { ok: true, via: 'spam' };

  if (inCooldown()) {
    return { ok: false, error: 'You just sent a message. Please wait a few seconds before sending another.' };
  }

  if (!site.contactEndpoint) {
    window.location.href = buildMailto(data);
    markSent();
    return { ok: true, via: 'mailto' };
  }

  try {
    const { website: _honeypot, ...payload } = data;
    const response = await fetch(site.contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, source: 'wolvo-website' }),
    });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    markSent();
    return { ok: true, via: 'endpoint' };
  } catch {
    return {
      ok: false,
      error: `Something went wrong while sending your message. Please try again or email us at ${site.email}.`,
    };
  }
}
