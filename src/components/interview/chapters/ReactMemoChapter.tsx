"use client";

import { AlwaysChangingPropsDemo } from "@/components/memo-demo/AlwaysChangingPropsDemo";
import { CheapRenderDemo } from "@/components/memo-demo/CheapRenderDemo";
import { ChildrenDemo } from "@/components/memo-demo/ChildrenDemo";
import { ContextDemo } from "@/components/memo-demo/ContextDemo";
import {
  InlinePropsBadDemo,
  InlinePropsGoodDemo,
} from "@/components/memo-demo/InlinePropsDemo";
import { SectionTabs } from "@/components/interview/SectionTabs";
import type { InterviewChapter } from "@/lib/interview-chapters";

export function ReactMemoChapter({ chapter }: { chapter: InterviewChapter }) {
  return (
    <SectionTabs
      sections={chapter.sections}
      childrenById={{
        "inline-props": <InlinePropsBadDemo />,
        "stable-refs": <InlinePropsGoodDemo />,
        children: <ChildrenDemo />,
        context: <ContextDemo />,
        "always-changing": <AlwaysChangingPropsDemo />,
        "cheap-render": <CheapRenderDemo />,
      }}
    />
  );
}
