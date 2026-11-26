import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Brain, GraduationCap, HeartHandshake, LayoutDashboard, MessageCircleQuestion, Presentation, type LucideIcon } from "lucide-react";

export type DemoApp = {
  id: string; name: string; description: string; icon: LucideIcon; gradient: string;
  Component: LazyExoticComponent<ComponentType>;
};

export const DEMO_APPS: DemoApp[] = [
  { id: "student", name: "AVERRA STUDENT", description: "Schedules, coursework and deadlines in one calm place.", icon: GraduationCap, gradient: "icon-student", Component: lazy(() => import("./StudentApp")) },
  { id: "family", name: "AVERRA FAMILY", description: "Progress, attendance and teacher messages for parents.", icon: HeartHandshake, gradient: "icon-family", Component: lazy(() => import("./FamilyApp")) },
  { id: "teacher", name: "AVERRA TEACHER", description: "Assignments, grading and attendance without the busywork.", icon: Presentation, gradient: "icon-teacher", Component: lazy(() => import("./TeacherApp")) },
  { id: "ai", name: "AVERRA AI", description: "Answers from approved school information — with sources.", icon: MessageCircleQuestion, gradient: "icon-ai", Component: lazy(() => import("./AssistantApp")) },
  { id: "study", name: "AVERRA STUDY", description: "AI study companion that explains concepts, creates practice questions, and generates study plans.", icon: Brain, gradient: "icon-study", Component: lazy(() => import("./StudyApp")) },
  { id: "admin", name: "AVERRA ADMIN", description: "Analytics, communications and permissions for leadership.", icon: LayoutDashboard, gradient: "icon-admin", Component: lazy(() => import("./AdminApp")) },
];
