import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getRateLimiter, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REDIS_KEY = "avishkar:visitor_count";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) return NextResponse.json({ count: 0 }, { status: 200 });
    const raw = await redis.get<number>(REDIS_KEY);
    const count = typeof raw === "number" ? raw : 0;
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error("[visitors] GET error", err);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const limiter = getRateLimiter("visitors", 5, "60 s");
    if (limiter) {
      const ip = getClientIp(req);
      const result = await limiter.limit(ip);
      if (!result.success) {
        return NextResponse.json(
          { ok: false, error: "Rate limit exceeded." },
          { status: 429 }
        );
      }
    }

    const redis = getRedis();
    if (!redis) return NextResponse.json({ count: 0 }, { status: 200 });
    const count = await redis.incr(REDIS_KEY);
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error("[visitors] POST error", err);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
