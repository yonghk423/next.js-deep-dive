import { queryOptions } from "@tanstack/react-query";
import { fetchUsers, usersQueryKeys, type UsersQueryParams } from "@/lib/users-api";

export const DEFAULT_USERS_PARAMS: Required<UsersQueryParams> = {
  count: 12,
  seed: 42,
};

/**
 * 서버 prefetch / 클라이언트 useQuery가 같은 key·queryFn을 공유합니다.
 * (실무에서 API 레이어 + queryOptions 패턴)
 */
export function usersListOptions(
  params: UsersQueryParams = DEFAULT_USERS_PARAMS,
) {
  const queryParams = {
    count: params.count ?? DEFAULT_USERS_PARAMS.count,
    seed: params.seed ?? DEFAULT_USERS_PARAMS.seed,
  };

  return queryOptions({
    queryKey: usersQueryKeys.list(queryParams),
    queryFn: () => fetchUsers(queryParams),
  });
}
