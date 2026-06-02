import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Simple server-side visitor counter with file persistence.
 *
 * - GET  /api/visitors  → returns the current count (no increment)
 * - POST /api/visitors  → increments the count by one and returns the new value
 *
 * Persistence is a tiny JSON file under `data/visitors.json`. This is
 * intentionally lightweight (no database). On read-only/serverless file systems
 * the write may fail; we fall back to an in-memory counter so the endpoint never
 * throws. Swap this for Redis/KV/a DB if you need durable, multi-instance counts.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");

// Seed value so the counter looks alive on first run. Real visits add to it.
const SEED = 10472;

// In-memory fallback for environments with a read-only filesystem.
let memoryCount: number | null = null;

async function readCount(): Promise<number> {
  if (memoryCount !== null) return memoryCount;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as { count?: number };
    return typeof parsed.count === "number" ? parsed.count : SEED;
  } catch {
    // File doesn't exist yet — start from seed.
    return SEED;
  }
}

async function writeCount(count: number): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({ count }), "utf8");
    memoryCount = null; // file is source of truth when writable
  } catch {
    // Read-only FS (e.g. some serverless hosts) — keep it in memory instead.
    memoryCount = count;
  }
}

export async function GET() {
  try {
    const count = await readCount();
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error("[visitors] GET error", err);
    return NextResponse.json({ count: SEED }, { status: 200 });
  }
}

export async function POST() {
  try {
    const next = (await readCount()) + 1;
    await writeCount(next);
    return NextResponse.json({ count: next }, { status: 200 });
  } catch (err) {
    console.error("[visitors] POST error", err);
    return NextResponse.json({ count: SEED }, { status: 200 });
  }
}
