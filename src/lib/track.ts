type TrackEvent = 'cta_click' | 'project_open' | 'article_open' | 'contact_open' | 'contact_submit' | 'whatsapp_click';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Privacy-conscious analytics hook. Emits a DOM event and pushes to a
 * dataLayer only if an analytics tool has been installed. No personal data.
 */
export function track(event: TrackEvent, detail: Record<string, string> = {}) {
  window.dispatchEvent(new CustomEvent('wolvo:track', { detail: { event, ...detail } }));
  window.dataLayer?.push({ event, ...detail });
}
