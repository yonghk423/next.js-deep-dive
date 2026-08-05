import { InterviewSidebar } from "@/components/interview/InterviewSidebar";

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 lg:flex-row lg:gap-8">
      <InterviewSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
