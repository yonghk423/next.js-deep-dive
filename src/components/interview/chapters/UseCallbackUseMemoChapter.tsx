"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { DemoCard } from "@/components/memo-demo/DemoCard";
import { RenderBadge } from "@/components/memo-demo/RenderBadge";
import { SectionTabs } from "@/components/interview/SectionTabs";
import type { InterviewChapter } from "@/lib/interview-chapters";

const MemoListItem = memo(function MemoListItem({
  label,
  onSelect,
}: {
  label: string;
  onSelect: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <button
        type="button"
        onClick={onSelect}
        className="text-sm underline-offset-2 hover:underline"
      >
        {label}
      </button>
      <RenderBadge failed />
    </div>
  );
});

const StableMemoListItem = memo(function StableMemoListItem({
  label,
  onSelect,
}: {
  label: string;
  onSelect: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2">
      <button
        type="button"
        onClick={onSelect}
        className="text-sm underline-offset-2 hover:underline"
      >
        {label}
      </button>
      <RenderBadge />
    </div>
  );
});

function CallbackChildDemo() {
  const [count, setCount] = useState(0);
  const [withCallback, setWithCallback] = useState(false);

  const unstable = () => console.log("select");
  const stable = useCallback(() => console.log("select"), []);

  return (
    <div className="grid gap-4">
      <DemoCard
        title={withCallback ? "useCallback 있음" : "useCallback 없음"}
        verdict={withCallback ? "good" : "bad"}
        description="자식이 memo일 때, 부모에서 만든 함수를 props로 넘기면 useCallback 유무에 따라 자식 리렌더가 갈립니다."
        lesson={{
          why: "함수도 객체처럼 참조 비교됩니다. 매 렌더 () => {}를 새로 만들면 memo 자식은 props가 바뀐 것으로 판단합니다. useCallback(..., [])은 같은 함수 참조를 유지합니다.",
          steps: [
            "기본(useCallback 끔)에서 '부모 count +1'을 여러 번 누릅니다 → 렌더 횟수 증가.",
            "'useCallback 켜기'로 전환합니다.",
            "다시 count를 올립니다 → 렌더 횟수가 유지되는지 확인합니다.",
          ],
          expect:
            "끔: 자식 렌더 증가. 켬: 자식 렌더 유지. (토글 시 컴포넌트가 바뀌어 카운터가 리셋될 수 있음)",
          codeTitle: "비교 코드",
          code: `const Item = memo(function Item({ onSelect }) {
  return <button onClick={onSelect}>item</button>
})

function Parent() {
  const [count, setCount] = useState(0)

  // ❌ 매 렌더 새 함수
  const bad = () => console.log("select")

  // ✅ 참조 고정
  const good = useCallback(() => console.log("select"), [])

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Item onSelect={good} />
    </>
  )
}`,
          tip: "useCallback은 memo 자식/의존성 배열에 함수를 넣을 때 의미가 큽니다. memo 없는 일반 자식에게만 넘긴다면 보통 이득이 작습니다.",
        }}
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
          >
            부모 count +1 ({count})
          </button>
          <button
            type="button"
            onClick={() => setWithCallback((v) => !v)}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
          >
            {withCallback ? "useCallback 끄기" : "useCallback 켜기"}
          </button>
        </div>
        {withCallback ? (
          <StableMemoListItem label="memo 아이템" onSelect={stable} />
        ) : (
          <MemoListItem label="memo 아이템" onSelect={unstable} />
        )}
      </DemoCard>
    </div>
  );
}

function expensiveFilter(items: number[], input: number) {
  let result = 0;
  for (let i = 0; i < 2_000_000; i++) {
    result += items[(i + input) % items.length] ?? 0;
  }
  return { sum: result, input };
}

function MemoValueDemo() {
  const [input, setInput] = useState(1);
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const items = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), []);

  useEffect(() => {
    setReady(true);
  }, []);

  const withoutMemoMs = ready
    ? (() => {
        const start = performance.now();
        expensiveFilter(items, input);
        return (performance.now() - start).toFixed(1);
      })()
    : "—";

  const withMemo = useMemo(() => {
    if (!ready) return { ms: "—" };
    const start = performance.now();
    expensiveFilter(items, input);
    return { ms: (performance.now() - start).toFixed(1) };
  }, [items, input, ready]);

  return (
    <div className="grid gap-4">
      <DemoCard
        title="useMemo로 비싼 계산 캐시"
        verdict="good"
        description="useMemo는 '렌더를 막는 도구'가 아니라, 의존성이 같을 때 이전 계산 결과를 재사용하는 도구입니다."
        lesson={{
          why: "컴포넌트가 리렌더되면 함수 본문이 다시 실행됩니다. 그 안의 무거운 계산을 useMemo로 감싸면, 의존성(input)이 바뀔 때만 다시 계산합니다. 무관한 카운터는 리렌더만 일으키고 계산 deps가 아닙니다.",
          steps: [
            "'계산과 무관한 카운터'만 여러 번 누릅니다 → 왼쪽(ms)은 매번 커지고, 오른쪽은 유지되는지 봅니다.",
            "'계산 입력값'을 누릅니다 → 양쪽이 다시 계산되는지 봅니다.",
            "ms 차이가 '캐시 히트 vs 미스'라는 점을 말로 정리합니다.",
          ],
          expect:
            "무관한 카운터: useMemo 쪽 ms 유지. 입력값 변경: useMemo도 다시 측정(재계산).",
          codeTitle: "핵심 코드",
          code: `const [input, setInput] = useState(1)
const [unrelated, setUnrelated] = useState(0)

// 매 렌더마다 실행됨
const slowEveryTime = expensive(input)

// input이 바뀔 때만 다시 실행
const slowCached = useMemo(
  () => expensive(input),
  [input]
)

// unrelated를 올려도 slowCached는 재계산 안 함`,
          tip: "싼 계산(대문자 변환 등)에 useMemo를 습관적으로 쓰지 마세요. '측정된 비싼 연산' 또는 '참조 안정화가 필요할 때'가 기준입니다.",
        }}
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setUnrelatedCount((t) => t + 1)}
            className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
          >
            계산과 무관한 카운터 +1 ({unrelatedCount})
          </button>
          <button
            type="button"
            onClick={() => setInput((t) => t + 1)}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
          >
            계산 입력값 +1 ({input})
          </button>
        </div>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded border border-red-200 px-3 py-2">
            <p className="text-xs text-red-700">useMemo 없음 (매 렌더 계산)</p>
            <p className="mt-1 font-mono">{withoutMemoMs} ms</p>
          </div>
          <div className="rounded border border-emerald-200 px-3 py-2">
            <p className="text-xs text-emerald-700">useMemo 있음</p>
            <p className="mt-1 font-mono">{withMemo.ms} ms</p>
            <p className="mt-1 text-xs text-zinc-500">
              의존성이 안 바뀌면 이전 결과를 재사용합니다.
            </p>
          </div>
        </div>
      </DemoCard>
    </div>
  );
}

function WhenNotDemo() {
  const [query, setQuery] = useState("");
  const upper = useMemo(() => query.toUpperCase(), [query]);

  return (
    <DemoCard
      title="의존성이 자주 바뀌면 이득 없음"
      verdict="unnecessary"
      description="입력할 때마다 query가 바뀌면 useMemo도 매번 재계산합니다. 게다가 toUpperCase는 원래 매우 싼 연산입니다."
      lesson={{
        why: "useMemo 이득 = (재계산을 건너뛴 횟수) × (계산 비용) − (훅/비교 오버헤드). 타이핑마다 deps가 바뀌면 건너뛸 일이 없고, 계산도 싸면 순손실에 가깝습니다.",
        steps: [
          "입력창에 글자를 빠르게 타이핑합니다.",
          "렌더 횟수가 입력마다 오르고, upper도 매번 바뀌는지 확인합니다.",
          "'여기에 useMemo가 필요한가?'에 대해 아니오라고 답할 이유를 적어봅니다.",
        ],
        expect:
          "입력마다 재계산됩니다. useMemo가 있어도 체감 이득이 없고, 코드만 복잡해집니다.",
        codeTitle: "불필요한 useMemo",
        code: `// ❌ 의존성이 매 입력마다 바뀜 + 연산이 쌈
const upper = useMemo(
  () => query.toUpperCase(),
  [query]
)

// ✅ 그냥 계산해도 충분
const upper = query.toUpperCase()`,
        tip: "면접에서 '항상 useMemo/useCallback을 쓰나요?' → '아니요. 비용·참조 안정성·측정된 병목이 있을 때 씁니다.'가 안전한 답입니다.",
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="타이핑해보세요"
        className="w-full rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm"
      />
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>
          upper = <code className="font-mono">{upper || "(empty)"}</code>
        </span>
        <RenderBadge failed />
      </div>
    </DemoCard>
  );
}

export function UseCallbackUseMemoChapter({
  chapter,
}: {
  chapter: InterviewChapter;
}) {
  return (
    <SectionTabs
      sections={chapter.sections}
      childrenById={{
        "callback-child": <CallbackChildDemo />,
        "memo-value": <MemoValueDemo />,
        "when-not": <WhenNotDemo />,
      }}
    />
  );
}
