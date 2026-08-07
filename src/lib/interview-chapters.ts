export type ConceptDefinition = {
  term: string;
  /** 한 줄 정의 */
  meaning: string;
  /** API 시그니처나 형태 (선택) */
  signature?: string;
};

export type InterviewSection = {
  id: string;
  title: string;
  summary: string;
  /** 이 섹션에서 다루는 핵심 용어 정의 */
  definition?: ConceptDefinition;
};

export type InterviewChapter = {
  slug: string;
  title: string;
  description: string;
  /** 챕터 전체에서 알아야 할 기능 정의 */
  definitions: ConceptDefinition[];
  sections: InterviewSection[];
};

/**
 * 면접 질문 챕터 목록.
 * 새 주제는 여기 + `src/app/interview/[chapter]/` 콘텐츠만 추가하면 됩니다.
 */
export const interviewChapters: InterviewChapter[] = [
  {
    slug: "react-memo",
    title: "React.memo",
    description:
      "memo가 언제 동작하고 언제 실패하는지, 설명·코드·실험으로 확인합니다.",
    definitions: [
      {
        term: "React.memo",
        signature: "memo(Component, arePropsEqual?)",
        meaning:
          "컴포넌트를 감싸 props가 이전과 얕게 같으면(shallow equal) 리렌더를 건너뛰는 Higher-Order Component입니다. 기본은 props 각 필드를 Object.is로 비교합니다.",
      },
      {
        term: "얕은 비교 (Shallow Compare)",
        meaning:
          "객체를 통째로 깊게 비교하지 않고, 최상위 props의 참조/원시값이 같은지만 봅니다. 중첩 객체 내용이 같아도 참조가 다르면 '다르다'고 판단합니다.",
      },
      {
        term: "리렌더 (Re-render)",
        meaning:
          "이미 마운트된 컴포넌트 함수가 다시 실행되어 UI를 다시 계산하는 과정입니다. 부모가 렌더되거나 state/context가 바뀌면 일어날 수 있습니다.",
      },
    ],
    sections: [
      {
        id: "inline-props",
        title: "인라인 props",
        summary:
          "객체·함수를 JSX에 인라인으로 쓰면 매 렌더 새 참조가 되어 memo가 실패합니다.",
        definition: {
          term: "인라인 props",
          meaning:
            "JSX 안에서 그 자리에서 새로 만든 값입니다. 예: style={{...}}, onClick={() => ...}. 매 렌더마다 새 참조가 생깁니다.",
        },
      },
      {
        id: "stable-refs",
        title: "참조 고정",
        summary:
          "useMemo/useCallback으로 참조를 고정하면 memo가 props를 같다고 판단합니다.",
        definition: {
          term: "참조 안정성 (Referential Stability)",
          meaning:
            "리렌더가 나도 같은 객체/함수 참조를 유지하는 성질입니다. memo·의존성 배열이 '같다'고 판단하려면 참조가 안정적이어야 합니다.",
        },
      },
      {
        id: "children",
        title: "children",
        summary:
          "children도 props입니다. 인라인 JSX는 글자가 같아도 새 element입니다.",
        definition: {
          term: "children",
          meaning:
            "컴포넌트 여는/닫는 태그 사이에 넣은 내용으로, props.children으로 전달됩니다. 인라인 JSX는 매 렌더 새 React element 객체입니다.",
        },
      },
      {
        id: "context",
        title: "Context",
        summary:
          "memo는 props만 막습니다. Context 구독 값은 바뀌면 무조건 리렌더됩니다.",
        definition: {
          term: "React Context",
          meaning:
            "props drilling 없이 트리 아래에 값을 전달하는 API입니다. useContext로 구독하면 Provider value가 바뀔 때 해당 컴포넌트가 리렌더됩니다.",
        },
      },
      {
        id: "always-changing",
        title: "항상 바뀌는 props",
        summary:
          "매초 바뀌는 값에는 memo 비교만 하고 스킵이 거의 없어 이득이 없습니다.",
        definition: {
          term: "memo의 전제 조건",
          meaning:
            "memo가 이득이 되려면 (1) props가 자주 같고 (2) 컴포넌트 렌더 비용이 비교 비용보다 커야 합니다. 값이 항상 바뀌면 스킵이 거의 없습니다.",
        },
      },
      {
        id: "cheap-render",
        title: "가벼운 컴포넌트",
        summary:
          "memo는 동작해도, 렌더가 싸면 비교 오버헤드 때문에 굳이 쓸 필요가 없습니다.",
        definition: {
          term: "최적화 오버헤드",
          meaning:
            "memo/useMemo/useCallback도 비교·캐시 관리 비용이 있습니다. 원래 렌더가 매우 싸면 최적화 자체가 더 비쌀 수 있습니다.",
        },
      },
    ],
  },
  {
    slug: "usecallback-usememo",
    title: "useCallback · useMemo",
    description:
      "두 훅의 역할(참조 안정화 / 계산 캐시)과 쓰지 말아야 할 경우를 코드로 비교합니다.",
    definitions: [
      {
        term: "useCallback",
        signature: "useCallback(fn, deps)",
        meaning:
          "함수 정의를 메모이제이션합니다. deps가 이전과 같으면 같은 함수 참조를 반환합니다. 주로 memo 자식에 넘기거나 다른 훅의 의존성으로 쓸 때 참조를 고정합니다.",
      },
      {
        term: "useMemo",
        signature: "useMemo(() => value, deps)",
        meaning:
          "계산 결과(값)를 메모이제이션합니다. deps가 같으면 이전 결과를 재사용합니다. 비싼 연산 캐시나 객체/배열 참조 안정화에 사용합니다.",
      },
      {
        term: "의존성 배열 (deps)",
        signature: "[a, b, c]",
        meaning:
          "훅이 '언제 다시 계산/생성할지' 기준이 되는 값 목록입니다. 배열 안 값이 바뀌면(Object.is) 콜백/계산을 다시 실행합니다.",
      },
    ],
    sections: [
      {
        id: "callback-child",
        title: "자식에 넘기는 함수",
        summary:
          "memo 자식 + 인라인 함수 vs useCallback을 토글하며 렌더 차이를 봅니다.",
        definition: {
          term: "useCallback",
          signature: "useCallback(fn, deps)",
          meaning:
            "deps가 변하지 않으면 동일한 함수 참조를 유지합니다. memo된 자식의 onClick 같은 props를 안정화할 때 효과적입니다.",
        },
      },
      {
        id: "memo-value",
        title: "비싼 계산",
        summary:
          "무관한 카운터와 계산 입력값을 구분해, useMemo가 언제 다시 도는지 확인합니다.",
        definition: {
          term: "useMemo",
          signature: "useMemo(() => value, deps)",
          meaning:
            "deps가 같을 때 이전 계산 결과를 재사용합니다. 리렌더 자체를 막지는 않고, 그 렌더 안의 비싼 일을 건너뛰게 합니다.",
        },
      },
      {
        id: "when-not",
        title: "쓰지 않아도 되는 경우",
        summary:
          "deps가 자주 바뀌고 연산이 싸면 useMemo는 이득 없이 코드만 복잡해집니다.",
        definition: {
          term: "언제 쓰지 않는가",
          meaning:
            "계산이 싸거나, deps가 거의 매 렌더 바뀌거나, 참조 안정화가 필요 없으면 useMemo/useCallback을 쓰지 않는 편이 낫습니다.",
        },
      },
    ],
  },
  {
    slug: "closure",
    title: "클로저 (Closure)",
    description:
      "함수가 외부 변수를 기억하는 원리부터, 루프 함정·React stale closure·프라이빗 상태까지 실험합니다.",
    definitions: [
      {
        term: "클로저 (Closure)",
        meaning:
          "함수와 그 함수가 선언된 렉시컬 환경(외부 변수들)의 조합입니다. 외부 함수 실행이 끝나도, 내부 함수는 그 외부 변수를 계속 참조할 수 있습니다.",
      },
      {
        term: "렉시컬 스코프 (Lexical Scope)",
        meaning:
          "변수를 어디서 찾을지가 '코드를 작성한 위치'로 결정되는 규칙입니다. 호출 위치가 아니라 선언 위치가 기준입니다.",
      },
      {
        term: "Stale Closure",
        meaning:
          "나중에 실행되는 콜백이 예전에 캡처한 값을 그대로 보고, 이미 바뀐 최신 state/props를 못 보는 현상입니다. React에서 특히 자주 등장합니다.",
      },
    ],
    sections: [
      {
        id: "basics",
        title: "기본 개념",
        summary:
          "createCounter가 반환한 함수가, 이미 끝난 외부 함수의 count를 계속 기억하는 모습을 봅니다.",
        definition: {
          term: "클로저",
          meaning:
            "내부 함수가 외부 함수의 변수에 접근·유지하는 것입니다. '값 복사'가 아니라 '변수 환경 참조'입니다.",
        },
      },
      {
        id: "loop-trap",
        title: "루프 함정",
        summary:
          "var처럼 공유된 i vs let처럼 반복마다 새 i — 같은 클로저 코드라도 결과가 달라집니다.",
        definition: {
          term: "변수 바인딩",
          meaning:
            "클로저가 붙잡는 것은 그 순간의 숫자 복사본이 아니라, 변수 자체입니다. 변수가 나중에 바뀌면 클로저도 그 변경을 봅니다.",
        },
      },
      {
        id: "stale-closure",
        title: "Stale Closure",
        summary:
          "setTimeout 콜백이 클릭 당시 count를 닫아두면, 그사이 state가 올라도 옛값이 출력됩니다.",
        definition: {
          term: "Stale Closure",
          meaning:
            "오래된 렌더에서 만든 함수가 그때의 state를 계속 참조하는 문제입니다. 타이머·구독·이벤트에서 흔합니다.",
        },
      },
      {
        id: "fix-stale",
        title: "고치는 법",
        summary:
          "ref에 최신을 동기화하거나 setState 함수형 업데이트로 stale을 피하는 방법을 실험합니다.",
        definition: {
          term: "함수형 업데이트",
          signature: "setState(prev => next)",
          meaning:
            "React가 최신 state를 prev로 넘겨 줍니다. 클로저에 닫힌 옛 state 대신 최신값으로 갱신할 수 있습니다.",
        },
      },
      {
        id: "private-state",
        title: "프라이빗 상태",
        summary:
          "클로저 안에 둔 balance는 반환 메서드로만 접근 가능해, 객체 밖으로 노출되지 않습니다.",
        definition: {
          term: "데이터 은닉 (Data Hiding)",
          meaning:
            "외부에서 직접 만질 수 없는 상태를 클로저로 감추고, 공개 API(메서드)만 제공하는 패턴입니다.",
        },
      },
    ],
  },
  {
    slug: "typescript",
    title: "TypeScript",
    description: "",
    definitions: [],
    sections: [],
  },
];

export function getChapter(slug: string) {
  return interviewChapters.find((c) => c.slug === slug);
}

export function getChapterSlugs() {
  return interviewChapters.map((c) => c.slug);
}
