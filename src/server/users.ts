import "server-only";

import type { User, UserRole, UserStatus, UsersApiResponse } from "@/lib/users-types";

const FIRST_NAMES = [
  "민수",
  "서연",
  "지훈",
  "하은",
  "도윤",
  "수아",
  "예준",
  "채원",
  "현우",
  "소율",
];

const EMAIL_LOCALS = [
  "minsu",
  "seoyeon",
  "jihun",
  "haeun",
  "doyun",
  "sua",
  "yejun",
  "chaewon",
  "hyunwoo",
  "soyul",
];

const LAST_NAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
const ROLES: UserRole[] = ["admin", "editor", "viewer"];
const STATUSES: UserStatus[] = ["active", "inactive", "pending"];

function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

function generateUsers(count: number, seed: number): User[] {
  const rng = createRng(seed);
  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    const last = pick(rng, LAST_NAMES);
    const firstIndex = Math.floor(rng() * FIRST_NAMES.length);
    const first = FIRST_NAMES[firstIndex]!;
    const year = 2022 + Math.floor(rng() * 4);
    const month = String(1 + Math.floor(rng() * 12)).padStart(2, "0");
    const day = String(1 + Math.floor(rng() * 28)).padStart(2, "0");

    users.push({
      id: i,
      name: `${last}${first}`,
      email: `${EMAIL_LOCALS[firstIndex]}${i}@example.com`,
      role: pick(rng, ROLES),
      status: pick(rng, STATUSES),
      score: Math.floor(rng() * 100),
      joinedAt: `${year}-${month}-${day}`,
    });
  }

  return users;
}

/**
 * Next.js 서버(Server Component / Route Handler) 전용 데이터 계층.
 * 별도 Express 서버 없이 같은 Next 프로세스가 API·페이지를 모두 담당합니다.
 */
export function getUsersResponse(
  count = 12,
  seed = 42,
): UsersApiResponse {
  const data = generateUsers(count, seed);
  return {
    ok: true,
    data,
    meta: {
      total: data.length,
      count: data.length,
      seed,
      generatedAt: new Date().toISOString(),
    },
  };
}
