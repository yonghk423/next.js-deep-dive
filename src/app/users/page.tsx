import { UsersTableSection } from "@/components/users/UsersTableSection";
import Link from "next/link";

export default async function UsersPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-zinc-500">
          <Link href="/" className="underline-offset-2 hover:underline">
            홈
          </Link>
          <span className="mx-1.5">/</span>
          유저 테이블
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          유저 목록
        </h1>
      </header>

      <UsersTableSection />
    </div>
  );
}
