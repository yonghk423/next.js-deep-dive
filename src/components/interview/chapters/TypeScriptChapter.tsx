import { UsersTableSection } from "@/components/users/UsersTableSection";
import type { InterviewChapter } from "@/lib/interview-chapters";

export async function TypeScriptChapter(_props: {
  chapter: InterviewChapter;
}) {
  return <UsersTableSection />;
}
