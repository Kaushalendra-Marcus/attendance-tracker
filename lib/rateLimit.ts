// Simple in-memory rate limiter
// Works per-IP, resets after windowMs

type RateLimitEntry = {
  count: number;
  firstRequest: number;
};

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  windowMs: number; 
  max: number;      
}

export function rateLimit(ip: string, options: RateLimitOptions): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const { windowMs, max } = options;

  const entry = store.get(ip);

  if (!entry || now - entry.firstRequest > windowMs) {
    store.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.firstRequest + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

// Helper to get IP from request
export function getIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
