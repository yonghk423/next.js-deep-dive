"use client";

import { memo, useState } from "react";
import { DemoCard } from "./DemoCard";
import { RenderBadge } from "./RenderBadge";

const Label = memo(function Label({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <span className="text-sm">{text}</span>
      <RenderBadge />
    </div>
  );
});

export function CheapRenderDemo() {
  const [count, setCount] = useState(0);

  return (
    <DemoCard
      title="렌더가 원래 싼 컴포넌트"
      verdict="unnecessary"
      description="props가 같아 memo는 스킵됩니다. 하지만 아주 가벼운 UI에는 비교 비용이 렌더 비용보다 클 수 있어 memo가 불필요합니다."
      lesson={{
        why: "memo는 공짜가 아닙니다. 이전 props와 새 props를 비교하는 비용이 있습니다. <span> 하나 그리는 정도면 그냥 렌더하는 편이 단순한 경우가 많습니다.",
        steps: [
          "부모 count를 올립니다.",
          "라벨 렌더 횟수가 안 오르는 것(memo 동작)을 확인합니다.",
          "그래도 '여기에 memo가 필요한가?'를 생각해 봅니다.",
        ],
        expect:
          "렌더 횟수는 유지됩니다. 동작은 맞지만, 성능상 의미 있는 최적화는 아닐 가능성이 큽니다.",
        codeTitle: "과도한 최적화 예시",
        code: `// 너무 가벼운 컴포넌트에 memo를 붙이는 패턴
const Label = memo(function Label({ text }: { text: string }) {
  return <span>{text}</span>
})

// 보통은 이렇게만 해도 충분
function Label({ text }: { text: string }) {
  return <span>{text}</span>
}`,
        tip: "면접 답변 프레임: 1) 병목 확인 2) props 안정성 확인 3) 그다음 memo/useMemo/useCallback. React Compiler가 있는 환경이면 수동 memo를 더 줄일 수 있다고도 말할 수 있습니다.",
      }}
    >
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="w-fit rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
      >
        부모 count +1 ({count})
      </button>
      <Label text="가벼운 라벨" />
      <p className="text-xs text-zinc-500">
        렌더 횟수가 안 늘어나는 건 맞지만, 최적화 대상이 아닙니다.
      </p>
    </DemoCard>
  );
}
