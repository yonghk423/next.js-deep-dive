"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { interviewChapters } from "@/lib/interview-chapters";

export function InterviewSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-4 border-b border-zinc-200 pb-4 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6 dark:border-zinc-800">
      <div>
        <Link
          href="/"
          className="text-xs text-zinc-500 underline-offset-2 hover:underline"
        >
          ← 홈
        </Link>
        <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          면접 실험실
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          챕터를 고르고 코드로 확인해보세요.
        </p>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
        {interviewChapters.map((chapter) => {
          const href = `/interview/${chapter.slug}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={chapter.slug}
              href={href}
              className={`whitespace-nowrap rounded px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {chapter.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
