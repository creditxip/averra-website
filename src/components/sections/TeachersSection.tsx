import { SectionShell } from "@/components/ui/section-shell";
import { TeacherWalkthrough } from "@/components/teachers/TeacherWalkthrough";
import { ParentNotifyDemo } from "@/components/teachers/ParentNotifyDemo";

export function TeachersSection() {
  return (
    <SectionShell id="teachers" eyebrow="For teachers" title="Less Administrative Work. More Time to Teach." tone="light">
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        A focused workspace where coursework, grading, attendance and family communication finally live in one place.
      </p>
      <TeacherWalkthrough />
      <ParentNotifyDemo />
    </SectionShell>
  );
}
