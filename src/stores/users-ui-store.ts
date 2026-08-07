"use client";

import { create } from "zustand";
import type { UserRole, UserStatus } from "@/lib/users-types";

type UsersUiState = {
  showJson: boolean;
  roleFilter: UserRole | "all";
  statusFilter: UserStatus | "all";
  toggleShowJson: () => void;
  setRoleFilter: (role: UserRole | "all") => void;
  setStatusFilter: (status: UserStatus | "all") => void;
  resetFilters: () => void;
};

/**
 * Zustand = 클라이언트 UI 상태 (서버 데이터가 아님)
 * 필터·패널 토글처럼 React Query 밖에 두는 값을 관리합니다.
 */
export const useUsersUiStore = create<UsersUiState>((set) => ({
  showJson: false,
  roleFilter: "all",
  statusFilter: "all",
  toggleShowJson: () => set((s) => ({ showJson: !s.showJson })),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  resetFilters: () => set({ roleFilter: "all", statusFilter: "all" }),
}));
