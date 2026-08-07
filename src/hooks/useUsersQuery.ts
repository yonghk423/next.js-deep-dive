"use client";

import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_USERS_PARAMS,
  usersListOptions,
} from "@/queries/users";
import type { UsersQueryParams } from "@/lib/users-api";

/** 클라이언트: 캐시에 있으면 사용, 없으면 / 만료 시 fetchUsers → GET /api/users */
export function useUsersQuery(params: UsersQueryParams = DEFAULT_USERS_PARAMS) {
  return useQuery(usersListOptions(params));
}
