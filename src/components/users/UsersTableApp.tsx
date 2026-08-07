"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useUsersQuery } from "@/hooks/useUsersQuery";
import { useUsersUiStore } from "@/stores/users-ui-store";
import { UsersTable } from "@/components/users/UsersTable";
import type { UserRole, UserStatus } from "@/lib/users-types";

/**
 * React Query = 서버 상태 (유저 목록)
 * Zustand = 클라이언트 UI 상태 (필터, JSON 패널)
 */
export function UsersTableApp() {
  const { data, error, isPending, isFetching, isError, refetch } =
    useUsersQuery();

  const {
    showJson,
    roleFilter,
    statusFilter,
    toggleShowJson,
    setRoleFilter,
    setStatusFilter,
    resetFilters,
  } = useUsersUiStore(
    useShallow((state) => ({
      showJson: state.showJson,
      roleFilter: state.roleFilter,
      statusFilter: state.statusFilter,
      toggleShowJson: state.toggleShowJson,
      setRoleFilter: state.setRoleFilter,
      setStatusFilter: state.setStatusFilter,
      resetFilters: state.resetFilters,
    })),
  );

  const users = data?.data ?? [];
  const filtered = useMemo(
    () =>
      users.filter((user) => {
        if (roleFilter !== "all" && user.role !== roleFilter) return false;
        if (statusFilter !== "all" && user.status !== statusFilter) return false;
        return true;
      }),
    [roleFilter, statusFilter, users],
  );

  const rawJson = data ? JSON.stringify(data, null, 2) : "";

  if (isPending) {
    return (
      <p className="rounded border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
        유저 목록 불러오는 중…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
        <span className="rounded bg-zinc-100 px-2 py-1 text-xs">
          React Query 캐시
        </span>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded border border-zinc-300 px-3 py-1.5 text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {isFetching ? "refetch 중…" : "refetch"}
        </button>
        <button
          type="button"
          onClick={toggleShowJson}
          className="rounded border border-zinc-300 px-3 py-1.5 text-zinc-800 hover:bg-zinc-50"
        >
          {showJson ? "JSON 숨기기" : "JSON 보기"}
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded border border-zinc-200 bg-zinc-50/80 px-3 py-3 text-sm">
        <span className="w-full text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Zustand UI 필터
        </span>
        <label className="flex flex-col gap-1 text-zinc-700">
          역할
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as UserRole | "all")
            }
            className="rounded border border-zinc-300 px-2 py-1.5"
          >
            <option value="all">전체</option>
            <option value="admin">관리자</option>
            <option value="editor">편집자</option>
            <option value="viewer">뷰어</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-zinc-700">
          상태
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as UserStatus | "all")
            }
            className="rounded border border-zinc-300 px-2 py-1.5"
          >
            <option value="all">전체</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="pending">대기</option>
          </select>
        </label>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded border border-zinc-300 px-3 py-1.5 text-zinc-800 hover:bg-white"
        >
          필터 초기화
        </button>
        <span className="ml-auto self-center text-xs text-zinc-500">
          {filtered.length} / {users.length}명
        </span>
      </div>

      {isError ? (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "요청 실패"}
        </p>
      ) : null}

      <UsersTable users={filtered} />

      {showJson && rawJson ? (
        <pre className="max-h-80 overflow-auto rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-5 text-zinc-800">
          {rawJson}
        </pre>
      ) : null}
    </div>
  );
}
