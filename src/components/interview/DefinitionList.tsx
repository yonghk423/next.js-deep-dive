import type { ConceptDefinition } from "@/lib/interview-chapters";

export function DefinitionList({
  title = "기능 정의",
  definitions,
}: {
  title?: string;
  definitions: ConceptDefinition[];
}) {
  if (definitions.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h2>
      <dl className="flex flex-col gap-3">
        {definitions.map((item) => (
          <div key={item.term} className="flex flex-col gap-1">
            <dt className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-semibold text-zinc-900">
                {item.term}
              </span>
              {item.signature ? (
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600">
                  {item.signature}
                </code>
              ) : null}
            </dt>
            <dd className="text-sm leading-6 text-zinc-600">{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function DefinitionCallout({
  definition,
}: {
  definition: ConceptDefinition;
}) {
  return (
    <div className="rounded border border-violet-200 bg-violet-50 px-4 py-3">
      <p className="text-xs font-semibold text-violet-800">정의</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-2">
        <span className="text-sm font-semibold text-violet-950">
          {definition.term}
        </span>
        {definition.signature ? (
          <code className="rounded bg-violet-100/80 px-1.5 py-0.5 font-mono text-[11px] text-violet-800">
            {definition.signature}
          </code>
        ) : null}
      </p>
      <p className="mt-1.5 text-sm leading-6 text-violet-950">
        {definition.meaning}
      </p>
    </div>
  );
}
