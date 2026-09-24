import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Next.js Deep Dive
      </h1>
      <p className="max-w-xl text-base leading-7 text-zinc-600">
        개념을 코드로 직접 깨뜨려 보며 확인합니다.
      </p>
      <Link
        href="/hydration"
        className="w-fit rounded bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white"
      >
        Hydration 실험 열기
      </Link>
    </div>
  );
}
