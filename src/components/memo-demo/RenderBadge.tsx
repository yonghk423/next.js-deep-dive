"use client";

import { useRenderCount } from "./useRenderCount";

export function RenderBadge({ failed }: { failed?: boolean }) {
  const count = useRenderCount();

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-xs tabular-nums ${
        failed
          ? "bg-red-100 text-red-800"
          : "bg-emerald-100 text-emerald-800"
      }`}
    >
      렌더 {count}회
    </span>
  );
}
