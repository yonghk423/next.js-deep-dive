import type { UsersApiError } from "@/lib/users-types";
import { getUsersResponse } from "@/server/users";
import { NextResponse } from "next/server";

/**
 * Next.js Route Handler = 풀스택 백엔드 HTTP API
 * GET /api/users?count=12&seed=42
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countParam = Number(searchParams.get("count") ?? "12");
  const seedParam = Number(searchParams.get("seed") ?? "42");

  if (!Number.isFinite(countParam) || !Number.isFinite(seedParam)) {
    const body: UsersApiError = {
      ok: false,
      error: {
        code: "INVALID_QUERY",
        message: "count와 seed는 숫자여야 합니다.",
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  const count = Math.min(Math.max(Math.trunc(countParam), 1), 100);
  const seed = Math.trunc(seedParam);

  await new Promise((resolve) => setTimeout(resolve, 250));

  const body = getUsersResponse(count, seed);

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}
