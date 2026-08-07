import {
  dehydrate,
  HydrationBoundary,
  type DehydratedState,
} from "@tanstack/react-query";
import { UsersTableApp } from "@/components/users/UsersTableApp";
import { makeQueryClient } from "@/lib/query-client";
import {
  DEFAULT_USERS_PARAMS,
  usersListOptions,
} from "@/queries/users";
import { getUsersResponse } from "@/server/users";

/**
 * 실무 패턴 (Next.js App Router + TanStack Query):
 * 1) 서버에서 prefetchQuery로 Query Cache 채움
 * 2) dehydrate → HydrationBoundary
 * 3) 클라이언트 useQuery가 같은 queryKey로 캐시 사용
 * 4) refetch 시 브라우저가 GET /api/users 호출
 */
export async function UsersTableSection() {
  const queryClient = makeQueryClient();
  const options = usersListOptions(DEFAULT_USERS_PARAMS);

  // Server Component는 내부 HTTP 왕복 없이 서비스 계층을 직접 호출합니다.
  await queryClient.prefetchQuery({
    ...options,
    queryFn: () =>
      Promise.resolve(
        getUsersResponse(
          DEFAULT_USERS_PARAMS.count,
          DEFAULT_USERS_PARAMS.seed,
        ),
      ),
  });

  const state: DehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={state}>
      <UsersTableApp />
    </HydrationBoundary>
  );
}
