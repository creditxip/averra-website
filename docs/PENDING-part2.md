# Pending copy update: sections 6–9 and 11

This work was ready to send to Lovable on 2026-11-25 but was rejected because the Lovable workspace was out of credits. Justin later asked to finish everything in GitHub instead of spending more Lovable credits. Implement this against the exported AVERRA site in this repo.

Source note from `/workspace/averra-notes/PENDING-part2.txt`:

> Part 2 prompt (S6-S9, S11) was rejected for no credits; resend the same text via send_message once credits are added.

Do **not** send this to Lovable. Apply it here.

---

## Instructions (exact client brief)

Copy & structure update part 2 of 2 (sections 6–9, 11). Keep everything else intact (design system, orbs, demo form, pricing exactly as is).

### S6 (`#compare`)

Title exactly: **Your School's Technology Should Work Together.**

Rebuild as an interactive side-by-side:

- LEFT panel **Traditional disconnected stack**: six separate, slightly scattered tool tiles with disconnected/dashed lines and separate logins: Learning management, Parent communication, School announcements, Student resources, AI tools, Mobile apps (generic labels, no brand names/logos).
- RIGHT panel **Unified AVERRA**: the same capabilities organized around one AVERRA hub with clean connected lines, one login, one school identity.
- Above/below: selectable category chips: Parent communication, Teacher workflows, School branding, Student engagement, AI assistance, Administrative visibility, Mobile experience, Existing system integration. Selecting a category highlights the relevant tiles on both sides and plays a short visual workflow demo (animated step sequence, e.g. Parent communication: left = teacher writes email → copies to portal → parent checks 3 places; right = teacher taps Notify Parent → parent receives in school app). For "Existing system integration" show AVERRA connecting to existing LMS/SIS/calendar with label "Integrations scoped during implementation".
- Keep a fair Canvas note: "Many schools rely on a learning management system such as Canvas, which offers assignments, grading, parent observer access, notifications, mobile apps and AI features. AVERRA is designed to complement your existing systems, not replace them — adding one branded, unified experience for your entire school community." Keep the Instructure trademark/non-affiliation footnote. No pricing comparisons, no "cheaper than" claims.

### S7 (`#calculator`)

Title exactly: **What Could Your School Save With a More Connected Technology Ecosystem?**

Rebuild the estimator inputs/outputs:

Inputs (slider + numeric input synced): Student enrollment; Number of administrative employees; Annual software expenses ($); Annual parent communication expenses ($); Other technology expenses ($); Weekly hours spent on repetitive administrative communication; Average hourly staff cost ($).

Automation scenario selector (segmented control): Conservative 15% / Moderate 25% / Ambitious 40% (percent of repetitive hours that could be returned) — labeled as an assumption.

Outputs with animated counters: Current annual technology expenses (= software + parent communication + other); Annual administrative hours on repetitive work (= weekly hours × 52, label "assumes 52 weeks; adjust as needed" or use a weeks/year input defaulting to 40 school weeks — pick one and label it clearly); Potential hours returned through automation (= annual hours × scenario %); Labor capacity value (= hours returned × hourly cost); Total potential operational value (= labor capacity value; optionally plus an editable "consolidation opportunity" % of current tech expenses defaulting to 0% labeled as your assumption). Charts: stacked bar of current expense breakdown and a bar/donut comparing scenarios. Results update live on every change.

Comparison block: "Your current annual technology expenses: $X" vs "A customized AVERRA proposal: tailored to your school" (no number, no Canvas prices, no claim AVERRA is cheaper) with a button that opens the demo form.

Disclaimer (visible): "Illustrative estimate based on the figures and assumptions you enter. Not a quote or a guarantee of savings. Actual results and AVERRA pricing depend on enrollment, AI usage, integrations, customization, support requirements and implementation scope."

Final CTA under the calculator: heading **Discover What Your School Could Accomplish With Averra.** + "Schedule a Personalized Demo" button (opens form).

### S8 (`#markets`)

Title exactly: **Designed for the Schools Shaping Tomorrow.**

Three geographic cards, each with a subtle animated map visual (minimal dotted/line SVG map of the region with gently pulsing points — no real school names):

- NEW ENGLAND — "Private and independent schools throughout Boston and the surrounding region."
- THE SOUTHEAST — "Independent schools across Georgia and Florida."
- NATIONWIDE — "Technology designed to support institutions across the country."

Then a role-benefits block (replace the previous role list with exactly these five): Headmasters, Deans of Students, Technology Directors, Teachers, Parents — interactive selector showing 3–4 benefits each (e.g. Headmasters: one branded experience for the whole community, visibility into engagement, modern image for prospective families; Deans of Students: attendance & communication in one place, faster family outreach, insight into student engagement; Technology Directors: fewer disconnected tools, role-based permissions, integrations scoped to your systems, managed app deployment; Teachers: less admin work, one-click parent notifications, AI drafting help; Parents: one app for everything about their child, timely alerts, direct teacher messages). No logos, no customer names, no testimonials.

### S9 (`#apps`)

Title exactly: **Your School's Own Application. We Handle the Technology.**

Show BOTH an iPhone mockup and an Android (Pixel-style, punch-hole camera, Android nav) mockup, plus supporting screens covering: school logo, branding, home screen, parent portal, student dashboard, AI assistant (keep the live brand customizer). Steps exactly: 01 Discovery, 02 Platform configuration, 03 Branding and customization, 04 App Store and Google Play submission assistance, 05 Launch and ongoing support. Keep callouts: schools retain ownership of their Apple and Google developer accounts and app identity; Averra receives authorized access to manage deployment; publication depends on Apple and Google review and approval.

### S11 (`#trust`)

Confirm title exactly: **Built Around the Responsibility of Educating Students.**

Then verify: no TypeScript/build errors, no console errors, responsive at 375/768/1280.
