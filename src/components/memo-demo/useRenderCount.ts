"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SSR/클라이언트 첫 페인트에서는 0으로 맞춰 hydration mismatch를 막고,
 * 마운트 이후에만 렌더 횟수를 집계합니다.
 */
export function useRenderCount() {
  const [ready, setReady] = useState(false);
  const countRef = useRef(0);

  useEffect(() => {
    setReady(true);
  }, []);

  if (ready) {
    countRef.current += 1;
  }

  return ready ? countRef.current : 0;
}
