import {
  FixedClientOnlyPreferences,
  HydrationMarker,
  InvalidHtmlNestingMismatch,
  ThemeFlickerDemo,
  ThemeFromLocalStorageMismatch,
  WindowWidthMismatch,
} from "@/components/hydration/HydrationDemos";
import Link from "next/link";

export default function HydrationPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-zinc-500">
          <Link href="/" className="underline-offset-2 hover:underline">
            홈
          </Link>
          <span className="mx-1.5">/</span>
          hydration
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Hydration 실험
        </h1>
      </header>

      <aside className="flex flex-col gap-3 rounded border border-zinc-200 bg-zinc-50 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          정의 · 외워두기
        </h2>
        <p className="text-base font-semibold leading-7 text-zinc-900">
          Hydration(하이드레이션)이란, 서버가 만들어 보낸 HTML에 브라우저의
          React가 이벤트·상태를 붙여 “살아 있는” UI로 만드는 과정이다.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-700">
          <li>
            <strong>서버</strong>: 컴포넌트를 HTML로 렌더해 먼저 화면을 보여 줌
          </li>
          <li>
            <strong>브라우저</strong>: 그 HTML을 받은 뒤 JS 번들을 로드함
          </li>
          <li>
            <strong>Hydration</strong>: React가 DOM과 Virtual DOM을 맞추고
            onClick 등 인터랙션을 연결함
          </li>
        </ul>
        <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
          <strong>Mismatch</strong>: 서버 HTML ≠ 클라 첫 렌더 → 경고.
          <br />
          <strong>Flicker</strong>: 첫 페인트는 light로 맞춘 뒤, effect에서
          dark를 적용하며 화면이 한 번 깜빡임.
        </p>
      </aside>

      <p className="text-sm leading-6 text-zinc-600">
        페이지를 열면 <strong>바로 아래 플리커</strong>가 Light → Dark로
        자동 재생됩니다. (버튼으로 테마를 고르는 2번 카드와 별개)
      </p>

      <HydrationMarker />
      <ThemeFlickerDemo />
      <ThemeFromLocalStorageMismatch />
      <WindowWidthMismatch />
      <InvalidHtmlNestingMismatch />
      <FixedClientOnlyPreferences />
    </div>
  );
}
