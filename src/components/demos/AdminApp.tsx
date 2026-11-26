import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, BarChart3, FileDown, KeyRound, Megaphone, MessagesSquare, Users } from "lucide-react";
import { AppShell, Chip, Panel, ViewTitle, btnGhost, btnPrimary, input, type NavItem } from "./AppShell";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type View = "engagement" | "teachers" | "announce" | "comms" | "kpis" | "perms" | "reports";
const NAV: NavItem<View>[] = [
  { id: "engagement", label: "Engagement", icon: Activity },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "announce", label: "Announcements", icon: Megaphone },
  { id: "comms", label: "Communications", icon: MessagesSquare },
  { id: "kpis", label: "Platform analytics", icon: BarChart3 },
  { id: "perms", label: "Permissions", icon: KeyRound },
  { id: "reports", label: "Reports", icon: FileDown },
];

function series(n: number, seed: number) {
  return Array.from({ length: n }, (_, i) => ({ label: n === 7 ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] : `${n === 30 ? "D" : "W"}${i + 1}`, students: Math.round(70 + 15 * Math.sin((i + seed) / 2.2) + i * (12 / n)), families: Math.round(55 + 12 * Math.cos((i + seed) / 3) + i * (20 / n)) }));
}
const RANGES = { "7d": series(7, 1), "30d": series(30, 2), Term: series(14, 3) };

export const AUDIENCES = ["All", "Students", "Families", "Staff", "Grade level"] as const;
const ROLES = ["Student", "Family", "Teacher", "Admin"] as const;
const PERMS = ["View grades", "Message teachers", "Post announcements", "Edit gradebook", "Manage users", "Use AI assistant"];
const DEFAULT_PERMS: Record<string, boolean[]> = {
  "View grades": [true, true, true, true], "Message teachers": [true, true, true, true], "Post announcements": [false, false, true, true],
  "Edit gradebook": [false, false, true, true], "Manage users": [false, false, false, true], "Use AI assistant": [true, true, true, true],
};

export function buildCsv(rows: (string | number)[][]) {
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}
const REPORTS: Record<string, (string | number)[][]> = {
  "Attendance summary": [["Grade", "Enrolled", "Avg attendance %", "Chronic absences"], [9, 142, 96.8, 3], [10, 138, 96.1, 4], [11, 135, 95.7, 5], [12, 131, 94.9, 6]],
  "Engagement report": [["Week", "Active students %", "Active families %"], ...series(8, 4).map((d) => [d.label ?? "", d.students, d.families])],
  "Communication report": [["Channel", "Messages", "Avg response (hrs)"], ["Teacher ↔ Family", 1284, 3.2], ["Announcements", 46, "—"], ["AI assistant questions", 2310, 0.01]],
};

export default function AdminApp() {
  const [view, setView] = useState<View>("engagement");
  const [range, setRange] = useState<keyof typeof RANGES>("30d");
  const [aud, setAud] = useState<(typeof AUDIENCES)[number]>("All");
  const [grade, setGrade] = useState("11");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState([{ title: "Midterm exam schedule posted", audience: "Students", time: "Mar 9" }]);
  const [perms, setPerms] = useState(DEFAULT_PERMS);

  const download = (name: string) => {
    const blob = new Blob([buildCsv(REPORTS[name]!)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `westbrook-${name.toLowerCase().replace(/\s+/g, "-")}-sample.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const audienceLabel = aud === "Grade level" ? `Grade ${grade}` : aud;

  return (
    <AppShell nav={NAV} active={view} onChange={setView} footer={<p className="text-xs text-muted-foreground">Westbrook Academy · Admin</p>}>
      {view === "engagement" && (<>
        <ViewTitle title="Student engagement" sub="Daily active % across the platform" action={
          <div role="group" aria-label="Range" className="flex rounded-lg border border-hairline bg-card p-0.5">{(Object.keys(RANGES) as (keyof typeof RANGES)[]).map((r) => (
            <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)} className={cn("rounded-md px-3 py-1 text-xs", range === r ? "bg-navy text-on-dark" : "text-muted-foreground")}>{r}</button>
          ))}</div>} />
        <Panel className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RANGES[range]} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--lavender)" stopOpacity={0.3} /><stop offset="1" stopColor="var(--lavender)" stopOpacity={0} /></linearGradient>
                <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--mint)" stopOpacity={0.35} /><stop offset="1" stopColor="var(--mint)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[30, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
              <Area type="monotone" dataKey="students" name="Students" stroke="var(--lavender)" strokeWidth={2} fill="url(#gs)" />
              <Area type="monotone" dataKey="families" name="Families" stroke="var(--mint)" strokeWidth={2} fill="url(#gf)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </>)}
      {view === "teachers" && (<>
        <ViewTitle title="Teacher management" />
        <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm">
          <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-medium">Name</th><th className="pb-2 font-medium">Department</th><th className="pb-2 font-medium">Classes</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Last active</th></tr></thead>
          <tbody className="divide-y divide-hairline">{[["Ms. Rivera", "Science", 3, "Active", "5 min ago"], ["Mr. Okafor", "Mathematics", 4, "Active", "1 hr ago"], ["Dr. Patel", "English", 3, "Active", "Today"], ["Sra. Morales", "World Languages", 5, "On leave", "Feb 28"], ["Mr. Grant", "History", 4, "Invited", "—"]].map(([n, d, c, s, l]) => (
            <tr key={n as string}><td className="py-2.5 font-medium">{n}</td><td>{d}</td><td>{c}</td><td><Chip tone={s === "Active" ? "mint" : s === "Invited" ? "lavender" : "muted"}>{s}</Chip></td><td className="text-muted-foreground">{l}</td></tr>
          ))}</tbody></table></div>
      </>)}
      {view === "announce" && (<>
        <ViewTitle title="Announcements" sub="Compose and publish (simulated)" />
        <div className="grid gap-5 lg:grid-cols-2">
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; setPosts((p) => [{ title: title.trim(), audience: audienceLabel, time: "Just now" }, ...p]); setTitle(""); setBody(""); }}>
            <div role="group" aria-label="Audience" className="flex flex-wrap gap-1.5">{AUDIENCES.map((a) => (
              <button key={a} type="button" aria-pressed={aud === a} onClick={() => setAud(a)} className={cn("rounded-full border px-3 py-1 text-xs", aud === a ? "border-lavender bg-lavender-soft" : "border-hairline")}>{a}</button>
            ))}</div>
            {aud === "Grade level" && <select aria-label="Grade" className={input} value={grade} onChange={(e) => setGrade(e.target.value)}>{["9", "10", "11", "12"].map((g) => <option key={g}>{g}</option>)}</select>}
            <input aria-label="Title" required className={input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea aria-label="Message" className={cn(input, "h-24")} placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} />
            <button type="submit" className={btnPrimary}>Publish</button>
          </form>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</p>
            <Panel><Chip tone="lavender">To: {audienceLabel}</Chip><p className="mt-2 text-sm font-medium">{title || "Your announcement title"}</p><p className="mt-1 text-sm text-muted-foreground">{body || "Message preview appears here."}</p></Panel>
          </div>
        </div>
        <p className="mt-6 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Published</p>
        <ul className="space-y-2">{posts.map((p, i) => <Panel key={i} className="flex items-center gap-2 text-sm"><span className="font-medium">{p.title}</span><Chip>{p.audience}</Chip><span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">{p.time}<Chip tone="mint">Simulated</Chip></span></Panel>)}</ul>
      </>)}
      {view === "comms" && (<>
        <ViewTitle title="Communications log" />
        <ul className="divide-y divide-hairline rounded-xl border border-hairline bg-card">{[["Announcement", "Midterm exam schedule → Students", "Mar 9, 4:10 PM", "Delivered 548"], ["Email", "Conference booking reminder → Families Gr 9–12", "Mar 8, 9:00 AM", "Opened 81%"], ["Push", "Early dismissal — weather → All", "Mar 4, 11:42 AM", "Delivered 1,204"], ["Message", "Ms. Rivera → 6 families", "Mar 3, 3:15 PM", "Read 5/6"]].map(([k, t, d, s]) => (
          <li key={t} className="flex flex-wrap items-center gap-2 p-3 text-sm"><Chip>{k}</Chip><span className="font-medium">{t}</span><span className="ml-auto text-xs text-muted-foreground">{d} · {s}</span></li>
        ))}</ul>
      </>)}
      {view === "kpis" && (<>
        <ViewTitle title="Platform analytics" sub="Last 30 days" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Active users", "1,186", "+6.2%"], ["Messages sent", "8,940", "+12%"], ["AI questions answered", "2,310", "+31%"], ["Avg response time", "3.2 hrs", "−18%"]].map(([k, v, d]) => (
          <Panel key={k}><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{v}</p><p className="mt-1 text-xs text-lavender">{d} vs. prior</p></Panel>
        ))}</div>
      </>)}
      {view === "perms" && (<>
        <ViewTitle title="User permissions" sub="Role-based access" />
        <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm">
          <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-medium">Permission</th>{ROLES.map((r) => <th key={r} className="pb-2 text-center font-medium">{r}</th>)}</tr></thead>
          <tbody className="divide-y divide-hairline">{PERMS.map((p) => (
            <tr key={p}><td className="py-2.5 font-medium">{p}</td>{ROLES.map((r, ri) => (
              <td key={r} className="text-center"><Switch aria-label={`${r}: ${p}`} checked={perms[p]![ri] ?? false} onCheckedChange={(v) => setPerms((x) => ({ ...x, [p]: x[p]!.map((b, j) => (j === ri ? v : b)) }))} /></td>
            ))}</tr>
          ))}</tbody></table></div>
      </>)}
      {view === "reports" && (<>
        <ViewTitle title="Administrative reporting" />
        <div className="grid gap-3 sm:grid-cols-3">{Object.keys(REPORTS).map((r) => (
          <Panel key={r}><FileDown className="size-5 text-lavender" aria-hidden /><p className="mt-3 text-sm font-medium">{r}</p><p className="text-xs text-muted-foreground">{REPORTS[r]!.length - 1} rows · sample data</p>
            <button type="button" className={cn(btnGhost, "mt-3")} onClick={() => download(r)}>Export CSV</button></Panel>
        ))}</div>
      </>)}
    </AppShell>
  );
}
