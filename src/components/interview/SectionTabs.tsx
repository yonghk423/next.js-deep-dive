"use client";

import { useEffect, useState } from "react";
import { DefinitionCallout } from "@/components/interview/DefinitionList";
import type { InterviewSection } from "@/lib/interview-chapters";

export function SectionTabs({
  sections,
  childrenById,
}: {
  sections: InterviewSection[];
  childrenById: Record<string, React.ReactNode>;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections.some((s) => s.id === hash)) {
      setActiveId(hash);
    }
  }, [sections]);

  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  function select(id: string) {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  if (!active) return null;

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="섹션"
        className="flex flex-wrap gap-1 border-b border-zinc-200 pb-3"
      >
        {sections.map((section) => {
          const selected = section.id === active.id;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => select(section.id)}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                selected
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {section.title}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="flex flex-col gap-4">
        {active.definition ? (
          <DefinitionCallout definition={active.definition} />
        ) : null}
        <div className="rounded border border-sky-200 bg-sky-50 px-4 py-3">
          <p className="text-xs font-semibold text-sky-800">이 탭에서 배울 것</p>
          <p className="mt-1 text-sm leading-6 text-sky-950">{active.summary}</p>
        </div>
        {childrenById[active.id]}
      </div>
    </div>
  );
}
