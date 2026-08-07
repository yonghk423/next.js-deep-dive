"use client";

import { useEffect, useRef, useState } from "react";
import { DemoCard } from "@/components/memo-demo/DemoCard";
import { SectionTabs } from "@/components/interview/SectionTabs";
import type { InterviewChapter } from "@/lib/interview-chapters";

function LogList({ logs }: { logs: string[] }) {
  return (
    <div className="max-h-40 overflow-y-auto rounded border border-zinc-200 bg-zinc-50 px-3 py-2">
      {logs.length === 0 ? (
        <p className="text-xs text-zinc-400">아직 로그 없음</p>
      ) : (
        <ul className="space-y-1 font-mono text-xs text-zinc-700">
          {logs.map((log, i) => (
            <li key={`${log}-${i}`}>{log}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 1) 클로저 기본: 외부 변수를 기억하는 함수 */
function BasicsDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const counterRef = useRef<ReturnType<typeof createCounter> | null>(null);

  function createCounter(start: number) {
    let count = start;
    return {
      inc() {
        count += 1;
        return count;
      },
      get() {
        return count;
      },
    };
  }

  function ensureCounter() {
    if (!counterRef.current) {
      counterRef.current = createCounter(0);
      setLogs((prev) => [...prev, "createCounter(0) 생성 → count를 닫아둠"]);
    }
    return counterRef.current;
  }

  return (
    <DemoCard
      title="클로저는 '기억하고 있는 함수'"
      verdict="good"
      description="함수가 선언될 때의 외부 변수(렉시컬 환경)를, 나중에 호출돼도 계속 참조할 수 있는 현상입니다."
      lesson={{
        why: "JS에서 함수는 자신이 만들어진 스코프의 변수를 '닫아' 둡니다(close over). createCounter가 끝나도 내부 inc/get은 count를 계속 봅니다. 이게 클로저입니다.",
        steps: [
          "'카운터 만들기'를 누릅니다.",
          "'+1 호출'을 여러 번 누릅니다.",
          "createCounter가 이미 끝났는데도 count가 유지되는지 로그로 확인합니다.",
        ],
        expect:
          "외부 함수 실행이 끝난 뒤에도, 반환된 함수가 같은 count를 공유하며 값이 누적됩니다.",
        codeTitle: "기본 형태",
        code: `function createCounter(start) {
  let count = start          // 외부 변수

  return function inc() {    // 내부 함수 = 클로저
    count += 1               // 외부 변수를 계속 참조
    return count
  }
}

const inc = createCounter(0)
inc() // 1
inc() // 2  ← createCounter는 끝났지만 count는 살아 있음`,
        tip: "면접 한 줄: '클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 외부 함수가 종료돼도 내부 함수가 외부 변수를 참조할 수 있습니다.'",
      }}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            counterRef.current = createCounter(0);
            setLogs(["createCounter(0) 생성 → count를 닫아둠"]);
          }}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
        >
          카운터 만들기
        </button>
        <button
          type="button"
          onClick={() => {
            const c = ensureCounter();
            const next = c.inc();
            setLogs((prev) => [...prev, `inc() → ${next}`]);
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          +1 호출
        </button>
        <button
          type="button"
          onClick={() => {
            const c = ensureCounter();
            setLogs((prev) => [...prev, `get() → ${c.get()}`]);
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          현재값 보기
        </button>
        <button
          type="button"
          onClick={() => {
            counterRef.current = null;
            setLogs([]);
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-500"
        >
          초기화
        </button>
      </div>
      <LogList logs={logs} />
    </DemoCard>
  );
}

/** 2) 루프 + var/let 함정 */
function LoopTrapDemo() {
  const [mode, setMode] = useState<"var" | "let">("var");
  const [logs, setLogs] = useState<string[]>([]);

  function runVarStyle() {
    const fns: Array<() => number> = [];
    // var처럼 함수 스코프 하나로 공유되는 변수를 흉내
    let i = 0;
    for (; i < 3; i++) {
      fns.push(() => i);
    }
    return fns.map((fn, idx) => `fns[${idx}]() → ${fn()}`);
  }

  function runLetStyle() {
    const fns: Array<() => number> = [];
    for (let i = 0; i < 3; i++) {
      fns.push(() => i);
    }
    return fns.map((fn, idx) => `fns[${idx}]() → ${fn()}`);
  }

  return (
    <DemoCard
      title="루프에서 닫는 변수가 같은가?"
      verdict="bad"
      description="var는 함수 스코프라 루프 변수 i를 모든 콜백이 공유합니다. let은 반복마다 새 바인딩이라 각 클로저가 다른 i를 봅니다."
      lesson={{
        why: "클로저는 '값이 복사된 스냅샷'이 아니라 '변수 바인딩'을 참조합니다. var i는 하나뿐이라 루프 끝의 i(3)를 모두가 봅니다. let i는 매 반복 새 변수입니다.",
        steps: [
          "'var 스타일 실행'을 누릅니다 → 결과가 전부 3인지 봅니다.",
          "'let 스타일 실행'을 누릅니다 → 0, 1, 2가 나오는지 비교합니다.",
          "왜 같은 () => i 코드인데 결과가 다른지 설명해 봅니다.",
        ],
        expect: "var 스타일: 3, 3, 3. let 스타일: 0, 1, 2.",
        codeTitle: "고전 함정",
        code: `// ❌ var: 같은 i를 모두가 참조
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 3 3 3
}

// ✅ let: 반복마다 새 i
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 0 1 2
}`,
        tip: "면접에서 '클로저가 값을 복사하나요?' → '아니요. 변수 환경을 참조합니다. 그래서 var/let 스코프 차이가 결과에 드러납니다.'",
      }}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("var");
            setLogs(runVarStyle());
          }}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
        >
          var 스타일 실행
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("let");
            setLogs(runLetStyle());
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          let 스타일 실행
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        마지막 실행:{" "}
        <code className="font-mono">{mode === "var" ? "var (공유 i)" : "let (반복별 i)"}</code>
      </p>
      <LogList logs={logs} />
    </DemoCard>
  );
}

/** 3) React stale closure */
function StaleClosureDemo() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  function scheduleStale() {
    const snapshot = count;
    setLogs((prev) => [
      ...prev,
      `예약 시점 count = ${snapshot} (이 값을 닫아둠)`,
    ]);
    window.setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `1초 후 콜백 실행 → 닫아둔 count = ${snapshot} (화면의 최신값과 다를 수 있음)`,
      ]);
    }, 1000);
  }

  return (
    <DemoCard
      title="React에서 흔한 Stale Closure"
      verdict="bad"
      description="이벤트/타이머 콜백이 '만들 당시'의 count를 닫아두면, 그사이 state가 바뀌어도 콜백은 옛값을 봅니다."
      lesson={{
        why: "매 렌더마다 새 함수가 생기고, 그때의 count를 캡처합니다. setTimeout에 넣은 함수는 예전 렌더의 클로저일 수 있어, 나중에 실행돼도 최신 state가 아닙니다.",
        steps: [
          "'1초 뒤 당시 count 출력'을 누릅니다.",
          "1초가 지나기 전에 count를 여러 번 올립니다.",
          "로그에 찍힌 값이 '예약 시점'인지 '최신값'인지 확인합니다.",
        ],
        expect:
          "타이머 콜백은 버튼을 누른 순간의 count를 출력합니다. 그사이 올려도 콜백 안의 값은 그대로입니다.",
        codeTitle: "stale 예시",
        code: `function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setTimeout(() => {
      console.log(count) // 클릭 당시 count (최신이 아닐 수 있음)
    }, 1000)
  }

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={handleClick}>1초 뒤 로그</button>
    </>
  )
}`,
        tip: "면접 키워드: Stale Closure. 해결은 함수형 업데이트 setCount(c => c+1), ref, 또는 effect deps를 올바르게 넣는 것입니다.",
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">
          현재 count: <code className="font-mono font-semibold">{count}</code>
        </span>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
        >
          count +1
        </button>
        <button
          type="button"
          onClick={scheduleStale}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          1초 뒤 당시 count 출력
        </button>
        <button
          type="button"
          onClick={() => setLogs([])}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-500"
        >
          로그 지우기
        </button>
      </div>
      <LogList logs={logs} />
    </DemoCard>
  );
}

/** 4) stale 고치기: ref / 함수형 업데이트 */
function FixStaleDemo() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  function scheduleWithRef() {
    setLogs((prev) => [...prev, `예약 (ref 방식) — 화면 count=${count}`]);
    window.setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `1초 후 ref.current = ${countRef.current} ← 항상 최신`,
      ]);
    }, 1000);
  }

  function scheduleFunctional() {
    setLogs((prev) => [...prev, `예약 (함수형 업데이트) — 화면 count=${count}`]);
    window.setTimeout(() => {
      setCount((latest) => {
        setLogs((prev) => [
          ...prev,
          `1초 후 setCount(latest => ...) 에서 latest = ${latest}`,
        ]);
        return latest + 1;
      });
    }, 1000);
  }

  return (
    <DemoCard
      title="Stale Closure 고치는 법"
      verdict="good"
      description="ref에 최신값을 동기화하거나, setState에 함수를 넘기면 '닫아둔 옛값' 문제를 피할 수 있습니다."
      lesson={{
        why: "ref.current는 mutable이라 클로저가 옛 count를 닫아도 ref 객체는 같고 current만 바뀝니다. 함수형 업데이트는 React가 최신 state를 인자로 넘겨 줍니다.",
        steps: [
          "count를 올린 뒤 'ref로 1초 뒤 읽기'를 누르고, 대기 중에도 count를 더 올립니다.",
          "로그가 최신값을 가리키는지 확인합니다.",
          "'함수형 +1 (1초 뒤)'도 같은 방식으로 시험합니다.",
        ],
        expect:
          "ref/함수형 업데이트는 대기 중 count가 바뀌어도 최신값을 기준으로 동작합니다.",
        codeTitle: "해결 패턴",
        code: `const countRef = useRef(count)
useEffect(() => { countRef.current = count }, [count])

setTimeout(() => {
  console.log(countRef.current) // 최신
}, 1000)

// 또는 함수형 업데이트
setTimeout(() => {
  setCount(latest => latest + 1)
}, 1000)`,
        tip: "useEffect/useCallback deps에 state를 빠뜨리면 stale closure가 납니다. 'deps를 속이지 말 것'이 면접에서 자주 나옵니다.",
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">
          현재 count: <code className="font-mono font-semibold">{count}</code>
        </span>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
        >
          count +1
        </button>
        <button
          type="button"
          onClick={scheduleWithRef}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          ref로 1초 뒤 읽기
        </button>
        <button
          type="button"
          onClick={scheduleFunctional}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          함수형 +1 (1초 뒤)
        </button>
        <button
          type="button"
          onClick={() => setLogs([])}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-500"
        >
          로그 지우기
        </button>
      </div>
      <LogList logs={logs} />
    </DemoCard>
  );
}

/** 5) 프라이빗 상태 (정보 은닉) */
function PrivateStateDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const bankRef = useRef<ReturnType<typeof createBank> | null>(null);

  function createBank(initial: number) {
    let balance = initial; // 외부에서 직접 못 봄
    return {
      deposit(n: number) {
        balance += n;
        return balance;
      },
      withdraw(n: number) {
        balance -= n;
        return balance;
      },
      // balance 자체를 노출하지 않음 — get으로만
      getBalance() {
        return balance;
      },
    };
  }

  function bank() {
    if (!bankRef.current) {
      bankRef.current = createBank(100);
      setLogs((prev) => [...prev, "createBank(100) — balance는 클로저 안에만 존재"]);
    }
    return bankRef.current;
  }

  return (
    <DemoCard
      title="클로저로 만드는 프라이빗 상태"
      verdict="good"
      description="balance 변수는 반환 객체 메서드만 접근할 수 있습니다. 객체에 balance 필드가 없어 밖으로 새지 않습니다."
      lesson={{
        why: "클래스 private 필드가 없던 시절부터, 클로저로 데이터를 감추는 패턴(모듈/팩토리)이 쓰였습니다. 반환된 메서드만 그 변수에 닿을 수 있습니다.",
        steps: [
          "'계좌 만들기' 후 입금/출금을 누릅니다.",
          "로그에 balance가 메서드를 통해서만 바뀌는지 확인합니다.",
          "'객체 키 보기'로 balance가 프로퍼티로 노출되지 않는지 확인합니다.",
        ],
        expect:
          "잔액은 getBalance/deposit/withdraw로만 조작됩니다. 객체 키에는 balance가 없습니다.",
        codeTitle: "팩토리 + 클로저",
        code: `function createBank(initial) {
  let balance = initial // private

  return {
    deposit(n) { balance += n; return balance },
    getBalance() { return balance },
  }
}

const account = createBank(100)
account.getBalance() // 100
account.balance      // undefined — 직접 접근 불가`,
        tip: "면접에서 '클로저 실사용 예' → 데이터 은닉, 함수 팩토리, 이벤트 핸들러, React 훅이 닫는 state/props 등을 말할 수 있습니다.",
      }}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            bankRef.current = createBank(100);
            setLogs(["createBank(100) — balance는 클로저 안에만 존재"]);
          }}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
        >
          계좌 만들기 (100원)
        </button>
        <button
          type="button"
          onClick={() => {
            const next = bank().deposit(50);
            setLogs((prev) => [...prev, `deposit(50) → ${next}`]);
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          +50 입금
        </button>
        <button
          type="button"
          onClick={() => {
            const next = bank().withdraw(30);
            setLogs((prev) => [...prev, `withdraw(30) → ${next}`]);
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          -30 출금
        </button>
        <button
          type="button"
          onClick={() => {
            const b = bank();
            const keys = Object.keys(b).join(", ");
            setLogs((prev) => [
              ...prev,
              `Object.keys → [${keys}] (balance 키 없음)`,
              `getBalance() → ${b.getBalance()}`,
            ]);
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        >
          객체 키 보기
        </button>
        <button
          type="button"
          onClick={() => {
            bankRef.current = null;
            setLogs([]);
          }}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-500"
        >
          초기화
        </button>
      </div>
      <LogList logs={logs} />
    </DemoCard>
  );
}

export function ClosureChapter({ chapter }: { chapter: InterviewChapter }) {
  return (
    <SectionTabs
      sections={chapter.sections}
      childrenById={{
        basics: <BasicsDemo />,
        "loop-trap": <LoopTrapDemo />,
        "stale-closure": <StaleClosureDemo />,
        "fix-stale": <FixStaleDemo />,
        "private-state": <PrivateStateDemo />,
      }}
    />
  );
}
