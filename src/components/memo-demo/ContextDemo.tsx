"use client";

import { createContext, memo, useContext, useState } from "react";
import { DemoCard } from "./DemoCard";
import { RenderBadge } from "./RenderBadge";

const ThemeContext = createContext<"light" | "dark">("light");

const Expensive = memo(function Expensive() {
  const theme = useContext(ThemeContext);

  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <span className="text-sm">
        theme = <code className="font-mono">{theme}</code>
      </span>
      <RenderBadge failed />
    </div>
  );
});

export function ContextDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [count, setCount] = useState(0);

  return (
    <DemoCard
      title="Context를 구독하는 memo 컴포넌트"
      verdict="bad"
      description="memo는 '부모 → 자식 props' 경로만 최적화합니다. useContext로 구독한 값이 바뀌면 memo와 무관하게 리렌더됩니다."
      lesson={{
        why: "Context Provider value가 바뀌면, 그 Context를 읽는 모든 컴포넌트가 다시 렌더됩니다. memo는 props 비교만 하므로 Context 업데이트를 막지 못합니다.",
        steps: [
          "'무관한 count +1'을 눌러봅니다 → 렌더 횟수가 안 오르면 memo가 props 경로에서는 동작 중.",
          "'theme 토글'을 눌러봅니다 → 렌더 횟수가 오르면 Context 구독 때문입니다.",
          "두 버튼의 차이를 말로 설명해 봅니다.",
        ],
        expect:
          "count만 바꿀 때: 자식 렌더 유지. theme를 바꿀 때: memo여도 자식이 다시 렌더.",
        codeTitle: "핵심 코드",
        code: `const ThemeContext = createContext("light")

const Expensive = memo(function Expensive() {
  const theme = useContext(ThemeContext) // 구독!
  return <div>{theme}</div>
})

// theme가 바뀌면 Expensive는 memo여도 리렌더됨
<ThemeContext.Provider value={theme}>
  <Expensive />
</ThemeContext.Provider>`,
        tip: "Context를 자주 바꾸면 memo로는 부족합니다. Context 분리, selector(사용 라이브러리), 또는 상태를 더 아래/옆으로 내리는 설계가 면접에서 자주 이어집니다.",
      }}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setTheme((t) => (t === "light" ? "dark" : "light"))
          }
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
        >
          theme 토글
        </button>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          무관한 count +1 ({count})
        </button>
      </div>
      <ThemeContext.Provider value={theme}>
        <Expensive />
      </ThemeContext.Provider>
    </DemoCard>
  );
}
