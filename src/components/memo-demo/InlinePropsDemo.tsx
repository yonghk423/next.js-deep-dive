"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { DemoCard } from "./DemoCard";
import { RenderBadge } from "./RenderBadge";

const MemoChild = memo(function MemoChild({
  style,
  onClick,
  label,
}: {
  style: React.CSSProperties;
  onClick: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <button
        type="button"
        style={style}
        onClick={onClick}
        className="text-sm underline-offset-2 hover:underline"
      >
        {label}
      </button>
      <RenderBadge failed />
    </div>
  );
});

const StableMemoChild = memo(function StableMemoChild({
  style,
  onClick,
  label,
}: {
  style: React.CSSProperties;
  onClick: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <button
        type="button"
        style={style}
        onClick={onClick}
        className="text-sm underline-offset-2 hover:underline"
      >
        {label}
      </button>
      <RenderBadge />
    </div>
  );
});

export function InlinePropsBadDemo() {
  const [count, setCount] = useState(0);

  return (
    <DemoCard
      title="인라인 객체 · 함수 props"
      verdict="bad"
      description="memo는 props를 얕은 비교(===)합니다. 객체와 함수를 JSX 안에서 새로 만들면 매 렌더 '다른 props'로 보입니다."
      lesson={{
        why: "JavaScript에서 { color: 'red' }와 () => {}는 값이 같아 보여도 매번 새 참조입니다. React.memo는 Object.is로 이전 props와 비교하기 때문에, 참조가 바뀌면 자식이 다시 렌더됩니다.",
        steps: [
          "아래 '부모 count +1'을 여러 번 누릅니다.",
          "오른쪽 '렌더 N회' 배지가 같이 올라가는지 확인합니다.",
          "자식의 label/색은 안 바뀌었는데도 렌더되는 이유를 코드와 연결해 생각합니다.",
        ],
        expect:
          "부모가 리렌더될 때마다 memo 자식의 렌더 횟수도 증가합니다. memo를 씌웠어도 이득이 없습니다.",
        codeTitle: "문제 코드",
        code: `const Child = memo(function Child({ style, onClick }) {
  return <button style={style} onClick={onClick}>클릭</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {/* 매 렌더마다 새 객체 / 새 함수 → memo 실패 */}
      <Child
        style={{ color: "red" }}
        onClick={() => console.log("hi")}
      />
    </>
  )
}`,
        tip: "면접에서 'memo를 쓰면 리렌더가 안 되나요?' → '아니요. props 참조가 바뀌면 다시 렌더됩니다. 객체/함수/배열을 인라인으로 넘기면 memo가 무력화됩니다.'",
      }}
    >
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="w-fit rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
      >
        부모 count +1 ({count})
      </button>
      <MemoChild
        label="memo 자식"
        style={{ color: "#dc2626" }}
        onClick={() => console.log("clicked")}
      />
    </DemoCard>
  );
}

export function InlinePropsGoodDemo() {
  const [count, setCount] = useState(0);
  const style = useMemo(() => ({ color: "#16a34a" }), []);
  const onClick = useCallback(() => console.log("clicked"), []);

  return (
    <DemoCard
      title="useMemo · useCallback으로 참조 고정"
      verdict="good"
      description="같은 상황에서 객체/함수 참조를 고정하면 memo가 props를 '같다'고 판단해 자식 렌더를 스킵합니다."
      lesson={{
        why: "useMemo는 값(객체) 참조를, useCallback은 함수 참조를 의존성이 같으면 재사용합니다. memo 자식에게 넘기는 props가 안정적이면 얕은 비교가 성공합니다.",
        steps: [
          "'부모 count +1'을 여러 번 누릅니다.",
          "자식 '렌더 N회'가 증가하지 않는지 확인합니다.",
          "위 탭(인라인 props)과 결과를 비교합니다.",
        ],
        expect:
          "부모만 리렌더되고 memo 자식의 렌더 횟수는 그대로입니다. (최초 마운트 횟수만 유지)",
        codeTitle: "해결 코드",
        code: `function Parent() {
  const [count, setCount] = useState(0)
  const style = useMemo(() => ({ color: "green" }), [])
  const onClick = useCallback(() => console.log("hi"), [])

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child style={style} onClick={onClick} />
    </>
  )
}`,
        tip: "useCallback/useMemo는 그 자체로 리렌더를 막는 게 아니라, memo(또는 deps)와 같이 쓸 때 참조 안정화 역할을 합니다.",
      }}
    >
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="w-fit rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
      >
        부모 count +1 ({count})
      </button>
      <StableMemoChild label="memo 자식" style={style} onClick={onClick} />
    </DemoCard>
  );
}
