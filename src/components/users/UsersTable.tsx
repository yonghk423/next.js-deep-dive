import type { User, UserRole, UserStatus } from "@/lib/users-types";

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "관리자",
  editor: "편집자",
  viewer: "뷰어",
};

const STATUS_LABEL: Record<UserStatus, string> = {
  active: "활성",
  inactive: "비활성",
  pending: "대기",
};

const STATUS_CLASS: Record<UserStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-zinc-100 text-zinc-600",
  pending: "bg-amber-100 text-amber-800",
};

export function UsersTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <p className="rounded border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
        표시할 유저가 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-zinc-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-3 py-2.5">ID</th>
            <th className="px-3 py-2.5">이름</th>
            <th className="px-3 py-2.5">이메일</th>
            <th className="px-3 py-2.5">역할</th>
            <th className="px-3 py-2.5">상태</th>
            <th className="px-3 py-2.5">점수</th>
            <th className="px-3 py-2.5">가입일</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {users.map((user) => (
            <tr key={user.id} className="bg-white hover:bg-zinc-50/80">
              <td className="px-3 py-2.5 font-mono text-zinc-500">{user.id}</td>
              <td className="px-3 py-2.5 font-medium text-zinc-900">
                {user.name}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-zinc-600">
                {user.email}
              </td>
              <td className="px-3 py-2.5 text-zinc-700">
                {ROLE_LABEL[user.role]}
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[user.status]}`}
                >
                  {STATUS_LABEL[user.status]}
                </span>
              </td>
              <td className="px-3 py-2.5 font-mono text-zinc-700">
                {user.score}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-zinc-500">
                {user.joinedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
