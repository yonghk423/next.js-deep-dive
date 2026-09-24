"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "demo-theme";

/** 하이드레이션이 끝난 뒤에만 true — useEffect는 브라우저에서만 실행됨 */
export function HydrationMarker() {
  const [hydrated, setHydrated] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <section className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-5">
      <h2 className="text-base font-semibold text-zinc-900">
        1. 하이드레이션 완료 감지
      </h2>
      <p className="text-sm leading-6 text-zinc-600">
        서버 HTML이 먼저 그려진 뒤, JS가 붙으면{" "}
        <code className="rounded bg-zinc-100 px-1 font-mono text-xs">
          useEffect
        </code>
        가 실행됩니다. 그 시점이 하이드레이션이 끝난 직후입니다.
      </p>
      <p className="text-sm">
        상태:{" "}
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            hydrated
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {hydrated ? "hydrated (클라이언트 활성)" : "HTML only (아직 JS 전)"}
        </span>
      </p>
      <button
        type="button"
        onClick={() => setClicks((c) => c + 1)}
        className="w-fit rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
      >
        클릭해 보기 ({clicks})
      </button>
    </section>
  );
}

/**
 * 실무 패턴 1: 다크모드/테마를 localStorage에서 렌더 중에 읽음
 * 서버에는 localStorage가 없어서 항상 light, 클라 첫 렌더는 저장된 값 → mismatch
 * UI에서 서버 HTML vs 클라 첫 렌더가 어떻게 충돌하는지 나란히 보여 줌
 */
export function ThemeFromLocalStorageMismatch() {
  // ❌ 렌더 단계에서 localStorage 접근 (실무에서 매우 흔함)
  const clientTheme =
    typeof window !== "undefined"
      ? (localStorage.getItem(THEME_KEY) ?? "light")
      : "light";

  // 서버는 항상 이 값으로 HTML을 만듦 (localStorage 없음)
  const serverTheme = "light";
  const isConflict = clientTheme !== serverTheme;

  function saveTheme(next: "light" | "dark") {
    localStorage.setItem(THEME_KEY, next);
    window.location.reload();
  }

  return (
    <section className="flex flex-col gap-4 rounded border border-red-200 bg-red-50/40 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          실무 빈도 높음
        </span>
        <h2 className="text-base font-semibold text-zinc-900">
          3. localStorage로 테마 읽기 (mismatch)
        </h2>
      </div>
      <p className="text-sm leading-6 text-zinc-600">
        아래에서 <strong>화이트 / 다크</strong>를 고르면 localStorage에 저장한 뒤
        새로고침합니다. 서버 HTML은 항상 light인데, 클라 첫 렌더는 저장값을
        읽어서 UI가 어긋나는 걸 나란히 볼 수 있습니다.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => saveTheme("light")}
          className={`rounded px-4 py-2 text-sm font-medium ${
            clientTheme === "light"
              ? "bg-zinc-900 text-white"
              : "border border-zinc-300 bg-white text-zinc-800"
          }`}
        >
          화이트 모드 저장 → 새로고침
        </button>
        <button
          type="button"
          onClick={() => saveTheme("dark")}
          className={`rounded px-4 py-2 text-sm font-medium ${
            clientTheme === "dark"
              ? "bg-zinc-900 text-white"
              : "border border-zinc-300 bg-white text-zinc-800"
          }`}
        >
          다크 모드 저장 → 새로고침
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(THEME_KEY);
            window.location.reload();
          }}
          className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-500"
        >
          저장값 지우기
        </button>
      </div>

      {isConflict ? (
        <p className="rounded border border-red-400 bg-red-100 px-3 py-2 text-sm font-semibold text-red-900">
          충돌! 서버 HTML = light, 클라 첫 렌더 = {clientTheme} → hydration
          mismatch (Console도 확인)
        </p>
      ) : (
        <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          지금은 둘 다 light라서 값이 같음. &quot;다크 모드 저장 → 새로고침&quot;을
          눌러 충돌을 재현해 보세요.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {/* 서버가 만든 HTML을 흉내 — 항상 light */}
        <div
          className="flex flex-col gap-2 rounded border border-zinc-300 p-4"
          style={{ background: "#ffffff", color: "#18181b" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            서버 HTML (항상)
          </p>
          <p className="text-lg font-semibold">theme = {serverTheme}</p>
          <p className="text-sm opacity-80">하얀 배경 · 검은 글자</p>
          <div className="mt-1 rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
            카드 미리보기
          </div>
        </div>

        {/* 클라 첫 렌더 — localStorage 반영 (mismatch 유발) */}
        <div
          className="flex flex-col gap-2 rounded border border-zinc-300 p-4"
          style={
            clientTheme === "dark"
              ? { background: "#18181b", color: "#fafafa" }
              : { background: "#ffffff", color: "#18181b" }
          }
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ opacity: 0.6 }}
          >
            클라 첫 렌더 (localStorage)
          </p>
          <p className="text-lg font-semibold">theme = {clientTheme}</p>
          <p className="text-sm" style={{ opacity: 0.8 }}>
            {clientTheme === "dark"
              ? "검은 배경 · 흰 글자"
              : "하얀 배경 · 검은 글자"}
          </p>
          <div
            className="mt-1 rounded border px-3 py-2 text-sm"
            style={
              clientTheme === "dark"
                ? {
                    borderColor: "#3f3f46",
                    background: "#27272a",
                    color: "#fafafa",
                  }
                : {
                    borderColor: "#e4e4e7",
                    background: "#fafafa",
                    color: "#18181b",
                  }
            }
          >
            카드 미리보기
          </div>
        </div>
      </div>

      <pre className="overflow-x-auto rounded border border-zinc-200 bg-white p-3 font-mono text-[12px] leading-5 text-zinc-800">
        {`// ❌ 실무 실수: 렌더 중 localStorage
const theme = typeof window !== "undefined"
  ? localStorage.getItem("theme") ?? "light"
  : "light"`}
      </pre>
    </section>
  );
}

/**
 * 실무 패턴 2: window.innerWidth로 모바일/데스크톱 UI 분기
 */
export function WindowWidthMismatch() {
  // ❌ 서버에는 window 없음 → 항상 desktop, 클라 좁은 화면이면 mobile
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <section className="flex flex-col gap-3 rounded border border-red-200 bg-red-50/40 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          실무 빈도 높음
        </span>
        <h2 className="text-base font-semibold text-zinc-900">
          4. window 너비로 UI 분기
        </h2>
      </div>
      <p className="text-sm leading-6 text-zinc-600">
        반응형에서 CSS 대신{" "}
        <code className="rounded bg-zinc-100 px-1 font-mono text-xs">
          window.innerWidth
        </code>
        로 컴포넌트 자체를 바꾸면, 서버 HTML(항상 desktop 가정)과 모바일
        브라우저 첫 렌더가 어긋납니다. DevTools를 모바일 폭으로 두고
        새로고침해 보세요.
      </p>
      <p className="font-mono text-sm text-red-800">
        렌더 결과: {isMobile ? "MobileNav" : "DesktopNav"}
        {typeof window !== "undefined"
          ? ` (width=${window.innerWidth})`
          : " (server)"}
      </p>
      <pre className="overflow-x-auto rounded border border-zinc-200 bg-white p-3 font-mono text-[12px] leading-5 text-zinc-800">
        {`// ❌ 실무 실수: 렌더 중 window
const isMobile = typeof window !== "undefined"
  && window.innerWidth < 768
return isMobile ? <MobileNav /> : <DesktopNav />`}
      </pre>
    </section>
  );
}

/**
 * 실무 패턴 3: 잘못된 HTML 중첩 — 브라우저가 DOM을 "고쳐" 버려 React와 안 맞음
 * <p> 안에 <div>는 유효하지 않음. 브라우저가 p를 닫아버림 → hydration mismatch
 */
export function InvalidHtmlNestingMismatch() {
  return (
    <section className="flex flex-col gap-3 rounded border border-red-200 bg-red-50/40 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
          찾기 어려움
        </span>
        <h2 className="text-base font-semibold text-zinc-900">
          5. 잘못된 HTML 중첩 (&lt;p&gt; 안 &lt;div&gt;)
        </h2>
      </div>
      <p className="text-sm leading-6 text-zinc-600">
        React는{" "}
        <code className="rounded bg-zinc-100 px-1 font-mono text-xs">
          &lt;p&gt;&lt;div/&gt;&lt;/p&gt;
        </code>
        를 그대로 보내려 하지만, 브라우저는 HTML 규칙상{" "}
        <code className="font-mono text-xs">&lt;p&gt;</code>를 먼저 닫아버립니다.
        DOM이 이미 바뀐 뒤라 hydration이 깨집니다. 카드/리스트에서{" "}
        <code className="font-mono text-xs">p</code> 래퍼를 습관적으로 쓸 때
        자주 납니다.
      </p>
      {/* 의도적 잘못된 마크업 */}
      <p className="rounded border border-dashed border-red-300 bg-white p-3 text-sm text-red-800">
        바깥은 p 태그인데
        <div className="mt-2 font-semibold">안에 div가 있음 (불법 중첩)</div>
      </p>
      <pre className="overflow-x-auto rounded border border-zinc-200 bg-white p-3 font-mono text-[12px] leading-5 text-zinc-800">
        {`// ❌ 브라우저가 DOM을 고쳐 버림
<p>
  텍스트
  <div>블록 요소</div>
</p>

// ✅ p → div 로 바꾸거나, 안쪽을 span 으로`}
      </pre>
    </section>
  );
}

/** 실무 수정: localStorage / window는 effect(또는 CSS) 이후에만 */
export function FixedClientOnlyPreferences() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(
      (localStorage.getItem(THEME_KEY) as "light" | "dark" | null) ?? "light",
    );
    setIsMobile(window.innerWidth < 768);
    setReady(true);
  }, []);

  return (
    <section className="flex flex-col gap-3 rounded border border-emerald-200 bg-emerald-50/40 p-5">
      <h2 className="text-base font-semibold text-zinc-900">
        6. 고친 패턴 (mismatch 없음)
      </h2>
      <p className="text-sm leading-6 text-zinc-600">
        서버·클라 <em>첫 렌더</em>는 같은 기본값을 쓰고,{" "}
        <code className="rounded bg-zinc-100 px-1 font-mono text-xs">
          useEffect
        </code>
        이후에만 localStorage / window를 반영합니다. 반응형은 가능하면 CSS
        media query가 더 안전합니다.
      </p>
      <ul className="space-y-1 font-mono text-sm text-emerald-900">
        <li>theme: {ready ? theme : "(첫 렌더: light — 서버와 동일)"}</li>
        <li>
          layout:{" "}
          {ready
            ? isMobile
              ? "MobileNav"
              : "DesktopNav"
            : "(첫 렌더: DesktopNav 가정)"}
        </li>
      </ul>
      <pre className="overflow-x-auto rounded border border-zinc-200 bg-white p-3 font-mono text-[12px] leading-5 text-zinc-800">
        {`// ✅ 첫 렌더는 동일, effect 뒤에만 클라 값
const [theme, setTheme] = useState("light")
useEffect(() => {
  setTheme(localStorage.getItem("theme") ?? "light")
}, [])`}
      </pre>
    </section>
  );
}

/**
 * Flicker: 페이지/컴포넌트가 처음 뜰 때
 * 1) 서버·클라 첫 페인트 = light
 * 2) effect 후 저장된 선호(데모에선 dark) 적용 → 깜빡임
 * 버튼으로 테마를 고르는 게 아니라, 첫 실행 순간을 보여 줌.
 */
export function ThemeFlickerDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [phase, setPhase] = useState<"first-paint" | "waiting" | "done">(
    "first-paint",
  );
  const [delayMs, setDelayMs] = useState(800);
  const [playId, setPlayId] = useState(0);

  useEffect(() => {
    // 매 재생마다 light에서 시작 (첫 페인트와 동일)
    setTheme("light");
    setPhase("waiting");

    const id = window.setTimeout(() => {
      // 실무: localStorage에 dark가 저장돼 있던 상황
      setTheme("dark");
      setPhase("done");
    }, delayMs);

    return () => window.clearTimeout(id);
  }, [delayMs, playId]);

  const isDark = theme === "dark";

  return (
    <section className="flex flex-col gap-4 rounded border border-violet-200 bg-violet-50/40 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
          UX · Flicker
        </span>
        <h2 className="text-base font-semibold text-zinc-900">
          2. 테마 플리커 (첫 실행 때 깜빡임)
        </h2>
      </div>
      <p className="text-sm leading-6 text-zinc-600">
        페이지를 열자마자(또는 아래 재생 시) 미리보기가{" "}
        <strong>Light → Dark</strong>로 바뀝니다. 서버 HTML은 항상 light로
        보내고, hydration 뒤 effect에서 dark를 적용할 때 생기는 현상입니다.
        (2번 mismatch 카드의 버튼 테스트와는 다름)
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          첫 페인트 유지 시간
          <input
            type="range"
            min={300}
            max={1500}
            step={100}
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
            className="w-48"
          />
          <span className="font-mono text-xs text-zinc-500">{delayMs}ms</span>
        </label>
        <button
          type="button"
          onClick={() => setPlayId((n) => n + 1)}
          className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm"
        >
          처음부터 다시 재생
        </button>
      </div>

      <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-700">
        <li className={phase === "first-paint" || phase === "waiting" ? "font-semibold text-violet-900" : ""}>
          첫 페인트: Light (서버 HTML과 동일 · mismatch 없음)
        </li>
        <li className={phase === "waiting" ? "font-semibold text-violet-900" : ""}>
          effect 대기 중… ({delayMs}ms)
        </li>
        <li className={phase === "done" ? "font-semibold text-violet-900" : ""}>
          선호 테마(dark) 적용 → 화면이 한 번 깜빡이며 전환
        </li>
      </ol>

      <div
        className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-lg border-2 p-8"
        style={
          isDark
            ? {
                background: "#09090b",
                color: "#fafafa",
                borderColor: "#3f3f46",
              }
            : {
                background: "#ffffff",
                color: "#18181b",
                borderColor: "#d4d4d8",
              }
        }
      >
        <p className="text-3xl font-semibold tracking-tight">
          {isDark ? "Dark UI" : "Light UI"}
        </p>
        <p className="text-sm opacity-70">
          {phase === "done"
            ? "effect로 dark 적용됨 (플리커 방금 발생)"
            : "첫 화면은 무조건 Light — 곧 Dark로 바뀜"}
        </p>
      </div>

      <pre className="overflow-x-auto rounded border border-zinc-200 bg-white p-3 font-mono text-[12px] leading-5 text-zinc-800">
        {`// 페이지 첫 로드 시나리오
useState("light")           // ① 서버·클라 첫 페인트 = light
useEffect(() => {
  setTheme("dark")          // ② 그다음 dark → 사용자가 보는 깜빡임
}, [])`}
      </pre>
    </section>
  );
}


