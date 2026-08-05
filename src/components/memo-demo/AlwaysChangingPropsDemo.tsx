"use client";

import { memo, useEffect, useState } from "react";
import { DemoCard } from "./DemoCard";
import { RenderBadge } from "./RenderBadge";

const Clock = memo(function Clock({ now }: { now: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <time className="font-mono text-sm" suppressHydrationWarning>
        {now === 0 ? "--:--:--" : new Date(now).toLocaleTimeString()}
      </time>
      <RenderBadge failed />
    </div>
  );
});

export function AlwaysChangingPropsDemo() {
  const [now, setNow] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <DemoCard
      title="거의 항상 바뀌는 props"
      verdict="bad"
      description="매초 바뀌는 now를 넘기면 memo는 비교만 하고, 결국 매초 다시 렌더합니다. 최신 UI가 목표면 memo가 이득이 아닙니다."
      lesson={{
        why: "memo의 이득은 'props가 자주 같을 때' 생깁니다. 시계처럼 값이 계속 바뀌면 비교 비용만 추가되고 스킵은 거의 없습니다.",
        steps: [
          "'타이머 시작'을 누릅니다.",
          "1초마다 시간이 바뀌고 렌더 횟수가 오르는지 확인합니다.",
          "'이 컴포넌트에 memo가 필요한가?'를 스스로 판단합니다.",
        ],
        expect: "타이머가 도는 동안 매초 렌더 횟수가 증가합니다.",
        codeTitle: "핵심 코드",
        code: `const Clock = memo(function Clock({ now }: { now: number }) {
  return <time>{new Date(now).toLocaleTimeString()}</time>
})

// now가 매초 바뀜 → memo 비교 실패 → 매초 렌더
setInterval(() => setNow(Date.now()), 1000)
<Clock now={now} />`,
        tip: "최적화는 '항상 붙이는 것'이 아니라 '병목이면서 props가 안정적인 곳'에 붙입니다. 측정 없이 memo부터 씌우지 말라는 질문이 자주 나옵니다.",
      }}
    >
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className="w-fit rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
      >
        {running ? "타이머 정지" : "타이머 시작"}
      </button>
      <Clock now={now} />
    </DemoCard>
  );
}
