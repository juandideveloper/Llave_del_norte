export function trackTikTokEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, data);
  }
}