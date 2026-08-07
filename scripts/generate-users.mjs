/**
 * 독립 Node 스크립트 — 테이블용 유저 JSON을 stdout으로 출력합니다.
 * 사용: node scripts/generate-users.mjs
 *       node scripts/generate-users.mjs 20 7
 */
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
const ROLES = ["admin", "editor", "viewer"];
const STATUSES = ["active", "inactive", "pending"];

function createRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function generateUsers(count = 12, seed = 42) {
  const rng = createRng(seed);
  const users = [];

  for (let i = 1; i <= count; i++) {
    const last = pick(rng, LAST_NAMES);
    const firstIndex = Math.floor(rng() * FIRST_NAMES.length);
    const first = FIRST_NAMES[firstIndex];
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

const count = Number(process.argv[2] ?? 12);
const seed = Number(process.argv[3] ?? 42);
const users = generateUsers(
  Number.isFinite(count) ? count : 12,
  Number.isFinite(seed) ? seed : 42,
);

process.stdout.write(
  JSON.stringify(
    { generatedAt: new Date().toISOString(), count: users.length, seed, users },
    null,
    2,
  ) + "\n",
);
