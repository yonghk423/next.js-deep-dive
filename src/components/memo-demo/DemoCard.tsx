"use client";

import { LessonGuide } from "@/components/interview/LessonGuide";

export function DemoCard({
  title,
  verdict,
  description,
  children,
  lesson,
}: {
  title: string;
  verdict: "bad" | "good" | "unnecessary";
  description: string;
  children: React.ReactNode;
  lesson?: {
    why: string;
    steps: string[];
    expect: string;
    code: string;
    codeTitle?: string;
    tip?: string;
  };
}) {
  const verdictLabel =
    verdict === "bad"
      ? "memo 무력화 / 비효율"
      : verdict === "good"
        ? "올바른 사용"
        : "불필요";
  const verdictClass =
    verdict === "bad"
      ? "bg-red-100 text-red-700"
      : verdict === "good"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-800";

  return (
    <section className="flex flex-col gap-4 border border-zinc-200 bg-white p-5">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${verdictClass}`}
          >
            {verdictLabel}
          </span>
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        </div>
        <p className="text-sm leading-6 text-zinc-600">{description}</p>
      </header>

      {lesson ? <LessonGuide {...lesson} /> : null}

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          직접 실험
        </h3>
        <div className="flex flex-col gap-3 rounded border border-dashed border-zinc-300 p-4">
          {children}
        </div>
      </div>
    </section>
  );
}
