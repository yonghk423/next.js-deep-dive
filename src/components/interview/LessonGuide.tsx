"use client";

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded border border-zinc-200 bg-zinc-50">
      {title ? (
        <div className="border-b border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500">
          {title}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-3 text-[12px] leading-5 text-zinc-800">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

export function LessonGuide({
  why,
  steps,
  expect,
  code,
  codeTitle,
  tip,
}: {
  why: string;
  steps: string[];
  expect: string;
  code: string;
  codeTitle?: string;
  tip?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded border border-zinc-200 bg-zinc-50/80 p-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          왜 이런가
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-zinc-700">{why}</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          이렇게 실험해보기
        </h3>
        <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm leading-6 text-zinc-700">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          기대한 결과
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-zinc-700">{expect}</p>
      </div>

      <div>
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          핵심 코드
        </h3>
        <CodeBlock code={code} title={codeTitle} />
      </div>

      {tip ? (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs font-semibold text-amber-800">면접 포인트</p>
          <p className="mt-1 text-sm leading-6 text-amber-900">{tip}</p>
        </div>
      ) : null}
    </div>
  );
}
