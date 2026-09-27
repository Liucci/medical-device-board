# Devix Design System
## Medical Device Management UI / UX Guidelines

Version: 1.0
Base: RoomDeviceInfoModal redesign
Product: Devix

---

# 1. Design Philosophy

Devix is a medical-device management system used in real clinical environments.

The UI must prioritize:

1. Immediate comprehension
2. Operational safety
3. Clear information hierarchy
4. Fast daily operations
5. Low visual noise
6. Consistent responsive behavior
7. Calm, professional medical-technology aesthetics

The interface should feel:

- Clean
- Reliable
- Professional
- Calm
- Dense enough for operational work, but never cluttered
- Modern without looking like a consumer application

Avoid decorative UI that does not improve comprehension or operation.

---

# 2. Core UX Principle

## "Understand first, operate second"

Information should be presented in this order:

1. What device is this?
2. What is its current status?
3. Is there an important alert?
4. Where is it?
5. Who/what is associated with it?
6. What needs to be done today?
7. What maintenance is required?
8. What detailed management information exists?

The user should be able to understand the current state of a device within a few seconds.

---

# 3. Responsive Design

## Desktop

Desktop layouts may use multiple columns.

Typical structure:

- Main content: 7 / 12 columns
- Secondary content: 5 / 12 columns
- Gap: 16px (`gap-4`)

Use columns to reduce vertical scrolling and keep related operations together.

Example:

```text
┌──────────────────────┬─────────────────────┐
│ Location / Patient   │ Device Status       │
│ Device Information   │ Inspection           │
│ Inspection           │ Maintenance          │
└──────────────────────┴─────────────────────┘
```

## Mobile

Mobile must NOT preserve desktop side-by-side sections.

Everything becomes one vertical flow:

```text
Header
↓
Status
↓
Alert
↓
Location / Patient
↓
Device Information
↓
Inspection
↓
Maintenance
```

Use:

```tsx
grid-cols-1
lg:grid-cols-12
```

Do not create horizontal scrolling for normal content.

The modal itself should become a full-height mobile experience:

```tsx
h-full w-full
```

On desktop:

```tsx
sm:h-auto
sm:max-h-[94vh]
sm:max-w-6xl
```

---

# 4. Global Layout

## Modal Overlay

Recommended:

```tsx
fixed inset-0
z-50
bg-slate-950/65
backdrop-blur-sm
```

Desktop:

```tsx
sm:p-4
```

Mobile:

```tsx
p-0
```

The background should be dark enough to clearly separate the modal from the application.

Avoid excessive blur.

---

# 5. Modal Container

Base:

```tsx
bg-slate-50
text-slate-900
```

Desktop:

```tsx
sm:rounded-2xl
sm:border
sm:border-slate-300
sm:shadow-2xl
```

The modal should have:

```tsx
flex
flex-col
overflow-hidden
```

The content area should be independently scrollable:

```tsx
min-h-0
flex-1
overflow-y-auto
```

Do not create nested scroll areas unless there is a strong operational reason.

---

# 6. Color System

## Primary Background

Application background:

```text
slate-50
```

Main content surface:

```text
white
```

Secondary surface:

```text
slate-50
```

## Primary Text

Main:

```text
slate-900
```

Secondary:

```text
slate-700
```

Muted:

```text
slate-500
```

Very muted:

```text
slate-400
```

## Borders

Normal:

```text
slate-200
```

Stronger:

```text
slate-300
```

Dark header:

```text
slate-700 / slate-800
```

## Primary Action

Devix primary action:

```text
teal-700
```

Hover:

```text
teal-800
```

Light primary surface:

```text
teal-50
```

Primary text on light surface:

```text
teal-700 / teal-800
```

Teal should communicate normal action / inspection / operational focus.

---

# 7. Semantic Status Colors

Use color only when it communicates state.

## Normal / Safe

```text
emerald-700
emerald-400
emerald-50
```

Examples:

- Normal operation
- Completed maintenance
- Sufficient remaining time

## Warning

```text
amber-700
amber-400
amber-50
```

Examples:

- Deadline approaching
- Standby
- Short-term warning

## Critical

```text
rose-700
rose-600
rose-50
```

Examples:

- Overdue
- Important alert
- Destructive operation

## Neutral / Cancelled

```text
slate-400
slate-500
slate-50
```

Examples:

- Cancelled task
- No information
- Disabled state

Do not use semantic colors as decoration.

---

# 8. Header

The header is dark and visually strong.

Recommended:

```tsx
bg-slate-900
text-white
```

Structure:

```text
Asset Type / Management Number

Device Type
Model
```

Example:

```text
人工呼吸器 / No. ME-00123

Servo-i
```

Management numbers should use a monospace font:

```tsx
font-mono
```

The header should remain compact.

Avoid oversized hero-style headers inside operational modals.

---

# 9. Status Bar

Place the current operational state directly below the header.

Typical information:

- Operating status
- Current location
- Today's inspection count

Use a compact grid.

Desktop:

```text
3 columns
```

Mobile:

```text
2 columns, with important information allowed to occupy a full row
```

Status text should be visually stronger than labels.

Example:

```text
稼働状態
通常稼働中
```

Use:

```tsx
text-sm font-bold
```

for the status.

---

# 10. Alert Design

Alerts should appear before normal content.

Do not hide important warnings deep inside the modal.

Recommended structure:

```text
[Alert Icon]  Important Alert

返却期限超過（2日遅れ）。
契約更新または返却手続きを確認してください。
```

Critical:

```text
border-rose-300
bg-rose-50
text-rose-900
```

Warning:

```text
border-amber-300
bg-amber-50
text-amber-900
```

Use an icon only for the alert itself.

Do not decorate every row with warning icons.

---

# 11. Cards / Sections

All major information groups should use a consistent section style.

Base:

```tsx
rounded-xl
border
border-slate-200
bg-white
shadow-sm
```

Section header:

```tsx
border-b
border-slate-100
px-4
py-3
```

Desktop padding may increase:

```tsx
sm:px-5
```

Section titles:

```tsx
text-xs
font-bold
tracking-wide
text-slate-700
```

Avoid large headings inside dense operational interfaces.

---

# 12. Information Rows

Use compact horizontal rows.

Example:

```text
配置場所                  ICU / Room 12
```

Label:

```text
text-xs
font-medium
text-slate-500
```

Value:

```text
text-sm
font-bold
text-slate-900
```

Values should normally be aligned to the right when the row is simple.

Use:

```tsx
flex
items-center
justify-between
gap-4
```

---

# 13. Device Information

Management information should be visually grouped.

Recommended:

```text
┌─────────────────────┬─────────────────────┐
│ ME管理番号          │ シリアル番号         │
│ ME-00123            │ ABC123              │
└─────────────────────┴─────────────────────┘
```

Use secondary surfaces:

```tsx
bg-slate-50
border-slate-200
rounded-lg
```

Identifiers:

```tsx
font-mono
font-bold
```

Edit actions should be subtle.

Preferred edit button:

```tsx
text-slate-400
hover:text-slate-700
hover:bg-slate-100
```

Do not use large edit buttons for small inline edits.

---

# 14. Primary Action Buttons

Primary actions should be visually obvious.

Example:

```tsx
h-12
w-full
rounded-xl
bg-teal-700
text-white
font-bold
hover:bg-teal-800
```

Use large buttons for important workflow transitions such as:

- Start inspection
- Confirm critical operational action

Avoid making every button large.

---

# 15. Secondary Buttons

Secondary actions:

```tsx
h-8
rounded-lg
border
border-slate-200
bg-slate-50
px-3
text-xs
font-bold
text-slate-700
```

Hover:

```text
bg-slate-100
```

Examples:

- Change
- Configure
- Edit
- Cancel secondary operation

---

# 16. Destructive Actions

Destructive actions must be visually separated from normal actions.

Example:

```tsx
border-rose-800/70
bg-rose-950/70
text-rose-300
```

For destructive operations:

- Delete device
- Cancel maintenance task

Use confirmation dialogs for irreversible actions.

Do not use red for ordinary buttons.

---

# 17. Inspection Section

Inspection is a core Devix workflow.

The inspection section should receive strong visual priority.

Recommended:

```text
Section title
Today's inspection count

2 回

[ 点検チェックシートを開く ]

実施時刻
08:12
13:42
```

The section may use:

```text
border-teal-200
```

to distinguish it from ordinary information.

Inspection action:

```text
teal-700
```

Inspection timestamps:

```text
teal-50
teal-800
```

The UI should communicate:

"Today's inspection status is known, and inspection can be started immediately."

---

# 18. Maintenance Section

Maintenance is an operational list, not a decorative card collection.

Each task should communicate:

1. Task name
2. Maintenance category
3. Due date
4. Remaining/overdue days
5. Available actions

Example:

```text
定期点検
使用中メンテナンス

期限  2026-09-30  残り2日

[実施] [修正] [中止]
```

Task state backgrounds:

Completed:

```text
bg-emerald-50
border-emerald-200
```

Overdue:

```text
bg-rose-50
border-rose-200
```

Near deadline:

```text
bg-amber-50/60
border-amber-200
```

Normal:

```text
bg-white
border-slate-200
```

Cancelled:

```text
bg-slate-50
border-slate-200
opacity-60
```

---

# 19. Maintenance Status Text

Prefer text over excessive icons.

Good:

```text
残り2日
```

```text
3日超過
```

```text
実施済
```

Avoid:

```text
🟢 残り2日
🟡 残り1日
🔴 3日超過
```

The color of the component already communicates the semantic state.

---

# 20. Icon Usage

## General Rule

Icons should be used sparingly.

Devix is an operational medical system, not an icon-heavy consumer dashboard.

Use icons only when they improve recognition or clarify an action.

Good uses:

- Close
- Delete
- Edit
- Add
- Inspection
- Critical alert
- Completed state

Avoid icons for every:

- Section title
- Data row
- Label
- Status
- Button
- Metadata item

Text should carry most of the meaning.

---

# 21. Icon Style

Use Lucide icons consistently.

Preferred characteristics:

```text
Small
Simple
Stroke-based
Neutral
```

Typical size:

```tsx
w-3.5 h-3.5
```

or:

```tsx
w-4 h-4
```

Do not mix many icon libraries within the same UI unless an existing domain-specific icon is required.

---

# 22. Typography

Primary UI font:

```text
sans-serif
```

Recommended hierarchy:

## Main device name

```text
text-base sm:text-lg
font-bold
```

## Section title

```text
text-xs
font-bold
tracking-wide
```

## Main values

```text
text-sm
font-bold
```

## Labels

```text
text-xs
font-medium
```

## Supporting text

```text
text-[11px]
```

Do not use many font sizes in the same component.

---

# 23. Spacing

Base spacing should follow Tailwind's 4px rhythm.

Common values:

```text
gap-1      4px
gap-1.5    6px
gap-2      8px
gap-3      12px
gap-4      16px
gap-5      20px
gap-6      24px
```

Preferred section spacing:

```text
gap-4
```

Preferred internal spacing:

```text
p-3
p-4
sm:p-5
```

Avoid excessive empty space.

---

# 24. Border Radius

Use a small set of consistent radii.

Large containers:

```text
rounded-xl
```

Modal:

```text
rounded-2xl
```

Small controls:

```text
rounded-lg
```

Small labels/status chips:

```text
rounded-md
```

Do not mix arbitrary radius values.

---

# 25. Shadows

Use shadows sparingly.

Cards:

```text
shadow-sm
```

Modal:

```text
shadow-2xl
```

Buttons generally do not need strong shadows.

The interface should rely primarily on:

- spacing
- borders
- background surfaces
- typography

rather than heavy shadows.

---

# 26. Interaction States

All interactive controls should have:

- clear hover state
- clear active state where appropriate
- pointer cursor
- adequate touch target

Avoid dramatic animations.

Recommended transitions:

```tsx
transition-colors
```

For primary action:

```tsx
transition-all
active:scale-[0.99]
```

Animations should support feedback, not decoration.

---

# 27. Mobile Touch UX

Mobile buttons must remain comfortably tappable.

Recommended minimum height:

```text
h-8
```

for compact controls.

Important actions:

```text
h-11
h-12
```

Avoid placing several tiny buttons directly beside each other when the screen is narrow.

If necessary, allow buttons to wrap:

```tsx
flex-wrap
```

Never allow the content to overflow horizontally.

---

# 28. Scroll Behavior

Preferred architecture:

```text
Modal
└── Header (fixed within modal)
└── Alert
└── Scrollable Main Content
```

Use:

```tsx
min-h-0
flex-1
overflow-y-auto
```

Avoid multiple independent vertical scroll containers.

The user should feel like they are scrolling through one coherent device information screen.

---

# 29. Information Density

Devix should be information-dense but visually calm.

Use:

- Compact labels
- Strong values
- Subtle borders
- Small supporting text
- Clear section separation

Avoid:

- Giant cards
- Excessive whitespace
- Large decorative illustrations
- Excessive gradients
- Excessive icons
- Excessive shadows
- Excessive rounded containers

---

# 30. Editing Pattern

Inline editing is preferred for simple values.

Examples:

```text
ME管理番号     ME-00123        [edit]
S/N            ABC123          [edit]
備考           ...             [edit]
```

Edit controls should be subtle.

Do not turn simple edits into visually heavy controls.

Existing application behavior such as prompt-based editing may remain unchanged when redesigning only the presentation layer.

---

# 31. Alert Priority

Alert priority:

### Level 1 — Critical

Examples:

- Rental return overdue
- Safety-related urgent condition

Visual:

```text
rose
```

Place near the top of the modal.

### Level 2 — Warning

Examples:

- Return due soon
- Long-term standby

Visual:

```text
amber
```

### Level 3 — Informational

Examples:

- Inspection count
- Current location

Visual:

```text
neutral / teal
```

Do not make informational content look like an alert.

---

# 32. Design Do / Don't

## DO

- Use clear hierarchy
- Use white cards on a slate background
- Use teal for primary operational actions
- Use semantic colors for actual states
- Keep labels small and values strong
- Use monospace for identifiers
- Keep icons limited
- Make mobile a single vertical flow
- Make inspection easy to find
- Make overdue tasks visually obvious
- Keep destructive actions visually distinct

## DON'T

- Do not overuse icons
- Do not use many accent colors
- Do not make every section colorful
- Do not use gradients as decoration
- Do not make every button a primary button
- Do not preserve desktop columns on mobile
- Do not create horizontal scrolling
- Do not make warnings visually subtle
- Do not use color without semantic meaning
- Do not introduce unrelated visual styles into Devix

---

# 33. AI Implementation Instructions

When an AI modifies an existing Devix UI:

1. Preserve existing business logic unless explicitly asked to change it.
2. Preserve existing props and state unless explicitly asked to change them.
3. Prefer Tailwind utility classes consistent with this document.
4. Reuse existing components and handlers.
5. Do not introduce a new visual language for a single screen.
6. Follow the same spacing, colors, typography, border radius, and button hierarchy.
7. On mobile, convert multi-column layouts to one vertical scroll flow.
8. Use icons sparingly.
9. Prioritize operational information over decoration.
10. Do not remove loading states or error feedback during visual redesign.
11. Do not silently change data behavior while redesigning UI.
12. If the requested change is visual only, restrict changes to the presentation layer.

---

# 34. Canonical Tailwind Tokens

Use these as the default Devix visual vocabulary.

## Background

```text
bg-slate-50
bg-white
bg-slate-900
```

## Text

```text
text-slate-900
text-slate-700
text-slate-500
text-slate-400
text-white
```

## Border

```text
border-slate-200
border-slate-300
border-slate-100
```

## Primary

```text
bg-teal-700
hover:bg-teal-800
text-teal-700
bg-teal-50
border-teal-200
```

## Success

```text
text-emerald-700
bg-emerald-50
border-emerald-200
```

## Warning

```text
text-amber-700
bg-amber-50
border-amber-200
```

## Critical

```text
text-rose-700
bg-rose-50
border-rose-200
```

## Radius

```text
rounded-md
rounded-lg
rounded-xl
rounded-2xl
```

## Shadow

```text
shadow-sm
shadow-2xl
```

---

# 35. Canonical Component Pattern

A typical Devix operational section should follow:

```tsx
<section className="rounded-xl border border-slate-200 bg-white shadow-sm">
  <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
    <div className="text-xs font-bold tracking-wide text-slate-700">
      セクション名
    </div>
  </div>

  <div className="p-4 sm:p-5">
    ...
  </div>
</section>
```

This pattern should be reused whenever appropriate.

---

# 36. Canonical Responsive Pattern

```tsx
<div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
  <div className="space-y-4 lg:col-span-7">
    ...
  </div>

  <div className="space-y-4 lg:col-span-5">
    ...
  </div>
</div>
```

This means:

- Mobile: one vertical flow
- Desktop: two functional columns

---

# 37. Design Identity

The Devix visual identity should be recognized through:

```text
Slate foundation
+
White operational cards
+
Teal primary actions
+
Semantic emerald / amber / rose states
+
Compact typography
+
Subtle borders
+
Limited icons
+
Strong information hierarchy
```

The goal is not to make Devix visually flashy.

The goal is to make Devix feel like a reliable digital medical-device control surface that clinical staff can understand immediately and operate confidently.
