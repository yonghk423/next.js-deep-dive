import { interviewChapters } from "@/lib/interview-chapters";
import Link from "next/link";

export default function InterviewIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          면접 실험실
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          왼쪽(또는 위) 목차에서 챕터를 고르면, 챕터 안에서는 탭으로 질문별
          데모를 확인합니다. 코드는 직접 조작하면서 렌더 결과를 보세요.
        </p>
      </header>

      <ul className="grid gap-3">
        {interviewChapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              href={`/interview/${chapter.slug}`}
              className="block border border-zinc-200 px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {chapter.title}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {chapter.description}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                섹션 {chapter.sections.length}개
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
