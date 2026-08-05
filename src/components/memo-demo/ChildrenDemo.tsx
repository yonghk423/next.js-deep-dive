"use client";

import { memo, useState } from "react";
import { DemoCard } from "./DemoCard";
import { RenderBadge } from "./RenderBadge";

const MemoCard = memo(function MemoCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <div className="text-sm">{children}</div>
      <RenderBadge failed />
    </div>
  );
});

export function ChildrenDemo() {
  const [count, setCount] = useState(0);

  return (
    <DemoCard
      title="children이 매번 새로 생성"
      verdict="bad"
      description="children도 props입니다. 부모 JSX에서 <p>...</p>를 인라인으로 넣으면 매 렌더 새 React element가 만들어집니다."
      lesson={{
        why: "React.createElement('p', ...)는 호출될 때마다 새 객체입니다. MemoCard가 memo여도 children 참조가 바뀌어 얕은 비교가 실패합니다. 텍스트가 같아도 '같은 children'이 아닙니다.",
        steps: [
          "부모 count만 올립니다.",
          "카드 안 글자는 그대로인데 렌더 횟수가 오르는지 봅니다.",
          "'고정 텍스트'라는 표현과 실제 참조 변화를 연결해 생각합니다.",
        ],
        expect: "children 내용이 안 바뀌어도 MemoCard 렌더 횟수가 같이 증가합니다.",
        codeTitle: "문제 코드",
        code: `const Card = memo(function Card({ children }) {
  return <div>{children}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {/* <p>는 매 렌더 새 element → children props 변경 */}
      <Card>
        <p>고정 텍스트</p>
      </Card>
    </>
  )
}`,
        tip: "children을 memo로 감싼 컴포넌트에 넘길 때는, children 자체를 안정화하거나 구조를 바꿔야 합니다. '글자가 같다 = props가 같다'가 아닙니다.",
      }}
    >
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="w-fit rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
      >
        부모 count +1 ({count})
      </button>
      <MemoCard>
        <p>고정 텍스트인데도 children 참조가 바뀜</p>
      </MemoCard>
    </DemoCard>
  );
}
