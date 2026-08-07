import {
  UsersApiErrorSchema,
  UsersApiResponseSchema,
  type UsersApiResponse,
} from "@/lib/users-types";

export const USERS_API_PATH = "/api/users";

export type UsersQueryParams = {
  count?: number;
  seed?: number;
};

export const usersQueryKeys = {
  all: ["users"] as const,
  list: (params: UsersQueryParams) =>
    [...usersQueryKeys.all, "list", params] as const,
};

function buildUsersUrl({ count = 12, seed = 42 }: UsersQueryParams = {}) {
  const search = new URLSearchParams({
    count: String(count),
    seed: String(seed),
  });
  return `${USERS_API_PATH}?${search.toString()}`;
}

/** 클라이언트에서 /api/users JSON을 받아 런타임 스키마로 검증합니다. */
export async function fetchUsers(
  params: UsersQueryParams = {},
): Promise<UsersApiResponse> {
  const res = await fetch(buildUsersUrl(params), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const json: unknown = await res.json();

  if (!res.ok) {
    const error = UsersApiErrorSchema.safeParse(json);
    throw new Error(error.success ? error.data.error.message : `HTTP ${res.status}`);
  }

  const body = UsersApiResponseSchema.safeParse(json);
  if (!body.success) {
    throw new Error("응답 JSON 형식이 올바르지 않습니다.");
  }

  return body.data;
}
