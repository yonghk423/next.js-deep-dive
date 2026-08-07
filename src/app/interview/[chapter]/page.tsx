import { ClosureChapter } from "@/components/interview/chapters/ClosureChapter";
import { ReactMemoChapter } from "@/components/interview/chapters/ReactMemoChapter";
import { TypeScriptChapter } from "@/components/interview/chapters/TypeScriptChapter";
import { UseCallbackUseMemoChapter } from "@/components/interview/chapters/UseCallbackUseMemoChapter";
import { DefinitionList } from "@/components/interview/DefinitionList";
import {
  getChapter,
  getChapterSlugs,
  type InterviewChapter,
} from "@/lib/interview-chapters";
import { notFound } from "next/navigation";

const chapterViews: Record<
  string,
  (
    props: { chapter: InterviewChapter },
  ) => React.ReactNode | Promise<React.ReactNode>
> = {
  "react-memo": ReactMemoChapter,
  "usecallback-usememo": UseCallbackUseMemoChapter,
  closure: ClosureChapter,
  typescript: TypeScriptChapter,
};

export function generateStaticParams() {
  return getChapterSlugs().map((chapter) => ({ chapter }));
}

export default async function InterviewChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const View = chapterViews[slug];
  if (!View) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {chapter.title}
        </h1>
        {chapter.description ? (
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">
            {chapter.description}
          </p>
        ) : null}
      </header>

      <DefinitionList definitions={chapter.definitions} />

      <View chapter={chapter} />
    </div>
  );
}
