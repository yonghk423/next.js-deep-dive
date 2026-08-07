import { QueryClient } from "@tanstack/react-query";

/** 서버 요청마다 새 QueryClient (요청 간 캐시 오염 방지) */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
