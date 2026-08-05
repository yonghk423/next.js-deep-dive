import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Next.js Deep Dive
      </h1>
      <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        면접 질문을 챕터별로 나눠, UI에서 직접 코드를 조작하며 확인합니다.
      </p>
      <Link
        href="/interview"
        className="w-fit rounded bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        면접 실험실 열기
      </Link>
    </div>
  );
}
