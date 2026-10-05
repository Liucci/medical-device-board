# Devix Design System
## Medical Device Management UI / UX Guidelines

Version: 1.1
Base: RoomDeviceInfoModal redesign & Inspection Checklist System
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

---

# 38. Information Card Display Rules

機器情報・病棟情報・患者情報など、個別の情報をカードとして表示する場合は、以下のルールを適用する。

## 38.1 編集可能な情報

ユーザーが現在の画面から編集できる情報は、薄い灰色の背景を使用する。

Recommended:

```tsx
bg-slate-50
border-slate-200
rounded-lg
```

編集可能であることを視覚的に伝え、操作対象を明確にする。

例:

- ME管理番号
- シリアル番号
- 患者名
- 備考
- 病棟・病室など、画面上で変更可能な情報

## 38.2 編集できない情報

ユーザーが現在の画面から編集できない情報は、白背景のカードを使用する。

Recommended:

```tsx
bg-white
border-slate-200
rounded-lg
```

編集可能なカードとの違いを背景色で明確にする。

色そのものを装飾目的で使用するのではなく、「編集可能 / 編集不可」という情報構造を伝えるために使用する。

## 38.3 カード内の基本構成

情報カードは原則として以下の構成とする。

```text
┌─────────────────────────┐
│ Title                   │
│ Value              [✎]  │
└─────────────────────────┘
```

### Title

情報の項目名を小さく表示する。

Recommended:

```tsx
text-[11px]
font-medium
text-slate-400
```

### Value

実際の情報を強調して表示する。

Recommended:

```tsx
text-sm
font-bold
text-slate-900
```

識別番号などは必要に応じて monospace を使用する。

```tsx
font-mono
```

### Edit Button

編集可能なカードには、Value の右側にペンシルアイコンによる編集ボタンを配置する。

編集ボタンは控えめにする。

Recommended:

```tsx
text-slate-400
hover:text-slate-700
hover:bg-slate-100
```

大きな「編集」ボタンを配置するのではなく、ペンシルアイコンによって編集可能であることを示す。

既存の編集処理・ハンドラー・データ更新処理は変更せず、表示レイヤーとしてこのパターンを適用する。

## 38.4 対になる情報の横並び

情報量が少なく、2つの情報を対にして表示した方が理解しやすい場合は、カードを横並びにする。

代表例:

- 機種名 / 型式名
- 病棟名 / 病室名
- ME管理番号 / シリアル番号

Recommended:

```tsx
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
  ...
</div>
```

モバイルでは1列、十分な画面幅では2列とする。

## 38.5 横並びにする判断基準

横並びにするかどうかは、単にカード数を減らすことではなく、「2つの情報を一組として理解できるか」で判断する。

横並びに適する例:

```text
機種名        型式名
Servo-i       12345
```

```text
病棟          病室
ICU           12号室
```

横並びにしない例:

```text
患者名
山田 太郎
```

```text
感染区分
MRSA
```

患者名や感染区分のように、それぞれ単独で意味を持ち、情報の重要度や表示条件が異なるものは縦方向に配置する。

## 38.6 Canonical Reference

機種名・型式名などの対になる情報を横並びで表示する場合は、現在の `RoomDeviceInfoModal` に採用されている機種名・型式名のUIを基準とする。

新しい画面で独自のカード表現を作らず、既存のDevix UIパターンを再利用する。

## 38.7 Information Card Decision Rule

AIがDevix UIを変更する際は、情報カードを実装する前に以下を判断する。

1. この情報は現在の画面から編集可能か？
2. 編集可能なら `bg-slate-50` を使用する。
3. 編集不可なら `bg-white` を使用する。
4. 編集可能な情報にはペンシルアイコンの編集操作を配置する。
5. 情報量が少なく、意味的に対になる2項目は横並びを検討する。
6. 対にならない情報は無理に横並びにしない。
7. モバイルでは横並びを解除し、1列にする。
8. 既存の `RoomDeviceInfoModal` の機種名・型式名UIを基準パターンとして再利用する。
9. UI変更時も既存の編集ロジック、ハンドラー、状態、API処理は変更しない。

このルールにより、機器情報・配置情報・患者情報などの表示方法を画面ごとに変えず、Devix全体で統一された情報カード表現を維持する。

## Editable Information — Edit Icon

編集可能な情報には編集アイコンを配置する。

原則として Lucide の Edit2 / Edit 系アイコンを使用する。

推奨サイズ:

```tsx
h-3.5 w-3.5
```

推奨スタイル:

```tsx
text-slate-400
hover:bg-slate-100
hover:text-slate-700
```

編集アイコンは情報カード内に控えめに配置し、編集可能であることを明確に示す。

---

# 39. Mobile & Bottom Sheet Design Guidelines

モバイル（幅640px未満 / `sm:` 未満）におけるモーダル、リスト、ダイアログ操作の標準仕様。

## 39.1 モバイルにおけるモーダル表示方式の選定基準（入力項目数による分岐）

モバイルにおけるモーダルは、一律ですべて全画面やボトムシートにするのではなく、**「入力・選択項目の情報量」**に応じて適切な表示形式を選択する。

### A. ボトムシート方式（Bottom Sheet / 画面下部ドッキング）

- **適用対象**: 入力・選択項目が少ないモーダル（**目安として4項目程度以下**）。
  - 例: 点検小項目の追加・編集モーダル、簡易ステータス変更、二択確認モーダル
- **UI仕様**:
  - スマホ全画面（`h-full w-full`）を覆わず、画面下部（`items-end p-0`）にドッキングして表示する。
  - 背景に親画面がうっすら見えていることで、ユーザーが「どの文脈で操作しているか」を見失わない。
  - 高さ基準: 下から約2/5（`h-[40vh]` または `h-2/5`）
  - 形状: 上部角丸（`rounded-t-2xl` または `rounded-t-3xl`）、上部境界線（`border-t border-slate-300`）
  - アニメーション: 下からのスライドイン（`animate-in slide-in-from-bottom duration-200`）
  - スマホ専用グラブバー: ヘッダー最上部にシートであることを示すつまみバー（`w-10 h-1 rounded-full bg-slate-600` / `sm:hidden`）を配置
  - スクロール分離: 入力項目やキーボード表示に対応するため、コンテンツ領域は必ず `min-h-0 flex-1 overflow-y-auto` とする。

Recommended Container:

```tsx
<div className="flex h-[40vh] w-full flex-col overflow-hidden rounded-t-2xl border-t border-slate-300 bg-slate-50 shadow-2xl transition-transform duration-200 animate-in slide-in-from-bottom sm:h-auto sm:max-h-[94vh] sm:max-w-xl sm:rounded-2xl sm:border sm:border-slate-300 sm:animate-none">
  {/* スマホ専用グラブバー */}
  <div className="flex justify-center pb-1.5 sm:hidden">
    <div className="h-1 w-10 rounded-full bg-slate-600" />
  </div>
  ...
</div>
```

### B. フルスクリーン方式（Full Screen / 全画面表示）

- **適用対象**: 入力項目や表示情報量が多いモーダル（**目安として5項目以上**や複数セクションを持つ管理画面）。
  - 例: `RoomDeviceInfoModal`（機器情報・病棟情報・点検履歴・メンテナンス一覧等を含む複合モーダル）、詳細設定モーダル
- **UI仕様**:
  - スマホ画面全体（`h-full w-full`）を使用し、1つの垂直スクロールフローで操作する。
  - PC画面（`sm:`）では中央配置（`sm:h-auto sm:max-h-[94vh] sm:max-w-6xl sm:rounded-2xl`）に切り替える。

---

## 39.2 モーダル背面のスクロール抑止（Body Scroll Lock）

モーダル表示中に背景画面（病棟リストや点検項目一覧など）が背後でスクロールすると、ユーザーの視線移動ストレスや誤操作の原因となるため、モーダルオープン時は背景のスクロールを完全に固定する。

Recommended Implementation:

```tsx
useEffect(() => {
  if (!open) return
  const originalOverflow = document.body.style.overflow
  document.body.style.overflow = "hidden"
  return () => {
    document.body.style.overflow = originalOverflow
  }
}, [open])
```

モーダルを閉じた際は必ず元のスタイルへクリーンアップ復元する。

---

## 39.3 モバイル2択アクションボタン（キャンセル・保存 / はい・いいえ）

モーダルフッターやダイアログにおける2択アクション（「キャンセル・保存」「はい・いいえ」など）は、スマホ時の親指操作性とタップしやすさを最優先する。

- **スマホ表示（幅640px未満）**:
  - 横幅100%を左右均等（各50%）に使用したフルワイド横並び配置（`flex w-full gap-2` かつ各ボタン `flex-1`）。
  - タップ高さを `h-10`（40px）〜 `h-11`（44px）確保し、誤タップを防ぐ。
- **PC表示（`sm:` 以上）**:
  - コンテナを右寄せ（`sm:justify-end sm:gap-3`）、各ボタンを標準幅（`sm:w-24 sm:h-9`、`sm:flex-none`）に自動切替。

Recommended Pattern:

```tsx
<div className="flex w-full gap-2 border-t border-slate-200 bg-white p-3 sm:justify-end sm:gap-3 sm:px-5 sm:py-3">
  <button
    type="button"
    onClick={onClose}
    className="flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
  >
    キャンセル
  </button>
  <button
    type="button"
    onClick={handleSave}
    className="flex h-10 flex-1 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white hover:bg-teal-800 sm:h-9 sm:w-24 sm:flex-none sm:text-sm"
  >
    保存
  </button>
</div>
```

---

## 39.4 モバイル用リスト・並び替え項目の最適化（Sortable Item）

狭いモバイル画面（375px〜）において、横スクロール（`overflow-x`）を発生させず、1画面内に多くの項目を視認できる高密度かつ操作性の高いリスト項目設計。

- **横スクロールの完全撤廃**: カード幅を画面幅に100%フィットさせ、横スクロールは絶対に出さない。
- **2行コンパクト構成**:
  - **1行目**: 専用ドラッググリップ帯 ＋ 編集アイコン ＋ 削除アイコン ＋ 項目名 ＋ 必須/任意バッジ
  - **2行目**: 項目名の左位置に合わせたインデント（`pl-[58px]`）で、カテゴリ・入力方式・単位タグを集約
- **専用ドラッググリップ帯**:
  - 左端に幅32px（`w-[32px]`）の薄グレー背景（`bg-slate-100`）グリップ帯を常設。
  - `touch-none` を指定し、スマホでの縦スクロールとドラッグ並び替えの衝突を防止。
- **垂直軸ドラッグ拘束**:
  - ドラッグ時に横ブレ（X軸ズレ）が起きないよう、`CSS.Translate` の X移動量を0に固定（`{ ...transform, x: 0 }`）し、DndContext に `modifiers={[restrictToVerticalAxis]}` を適用する。

---

## 39.5 アコーディオン・選択肢一覧の横幅抑制（常識的な幅の制限）

PC大画面において「任意の選択肢」やアコーディオンを展開した際、カードの全幅（700〜800px）まで横長に広がってしまうのを防ぐ。

- **クラス定義**: `w-fit min-w-[180px] max-w-xs sm:max-w-sm`
- **目的**:
  - コンテンツ量に応じた自然な幅（`w-fit`）としつつ、極端に短くならないよう最小幅（`min-w-[180px]`）を担保。
  - PC画面でも約320px〜384px（`max-w-xs sm:max-w-sm`）で上限を設け、ボタン直下にすっきりと収まる常識的な長さに保つ。

---

## 39.6 ネイティブ alert / confirm の完全撤廃と共通ダイアログ統一

ブラウザ標準のポップアップ（`window.alert` / `window.confirm`）は、操作感の断絶やデザインの崩れを招くため使用を禁止する。

- すべて `useConfirmModal` および `ConfirmModal`（共通 `InputModal` レイヤー）へ置き換える。
- 単一の確認（OKのみ）から二択確認（はい/いいえ、保存/キャンセル）まで、非同期 `await confirmModal.confirm(...)` で同期処理のように扱える構造とする。
- モバイルでは親指の届くボトムシートまたは中央モーダルとして美しく描画される。

---

# 40. Custom Scrollbar & Area Header Guidelines

病棟一覧（WardArea）およびストックエリア一覧（StockAreas）におけるスクロールバーとヘッダーの標準仕様。

## 40.1 クイックスクロールバー（QuickScrollBar）の配置と干渉防止

- **全画面サイズでの常時表示**:
  - `mobileOnly={false}` を指定し、PC・スマホ問わず画面サイズに関わらず常時表示する。
- **コンテンツ衝突の防止（安全マージンの常時確保）**:
  - コンテンツコンテナの右パディングは `pr-7`（28px）を固定で指定する。
  - 右端にオーバーレイ配置されるスクロールバー（幅24px: `w-6`）とカードの重なりを防ぐため、`sm:pr-1` 等で画面幅に応じて右余白を縮小することは禁止。
- **標準スクロールバーの非表示・二重化抑止**:
  - `QuickScrollBar` との二重表示を防ぐため、スクロールコンテナに `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]` を付与する。

## 40.2 エリア上部ヘッダーの省スペース化

- **スマホ表示（幅640px未満 / sm:未満）**:
  - 通常時は「エリアタイトル」＋「▼詳細ボタン」のみを表示し、高さを約30px（従来比約60%削減）に圧縮。
  - ▼ボタンタップ時のみ「最終更新日時」「お知らせ」「ズームスライダー」を下部にアコーディオン展開する。
- **PC表示（幅640px以上 / sm:以上）**:
  - タイトル・更新日時・お知らせ・ズームコントロールを1行（高さ約26〜28px）に集約する。
  - ズームコントロールバーの横幅は約160pxにスリム化する。
- **病棟ヘッダー機能の集約**:
  - 機器残数パネル（`LowStockPanel`）はヘッダー右側ズームコントロールの左隣に統合配置し、1行レイアウトを維持する。

---

# 41. Inspection Execution Screen Guidelines

点検実施画面（InspectionExecutionPage）におけるレイアウトおよびスクロール標準仕様。

## 41.1 左右カラムの縦幅同期と内部独立スクロール（2ペイン構成）

多数の点検項目（30〜40項目）が存在する場合でも、左側の機器情報を見失わず快適に点検入力を行える構造とする。

- **左右の縦幅同期**:
  - PC表示（`lg:` 以上）では、左側情報カラム全体の縦幅と右側点検項目セクションの縦幅を概ね同じ高さに揃える（`ResizeObserver` による動的高さ同期、または `lg:h-[650px]` / `lg:max-h-[calc(100vh-160px)]`）。
- **右側セクション内部スクロール**:
  - セクション全体を `flex flex-col` とし、ヘッダーを `shrink-0` で固定。
  - 点検項目一覧エリアを `min-h-0 flex-1 overflow-y-auto` で枠内独立スクロールさせる。項目数が増加しても枠が下に伸びず、左側情報が画面外に押し流されない。
- **左側点検表選択へのアクセス担保**:
  - 左側カラムも必要に応じて縦スクロール（`lg:overflow-y-auto`）を可能とし、画面の小さいPCでも下部の点検表選択セクションへ確実にアクセスできるようにする。

## 41.2 点検項目ヘッダーの件数バッジ配置（重なり防止）

- **インライン配置**:
  - 「全〇項目」バッジは右端（`justify-between`）ではなく、タイトル「点検項目」のすぐ右隣（`flex items-center gap-2`）に配置する。
- **説明文の独立**:
  - 操作説明文（「各項目を確認・入力してください...」）は2行目に独立配置し、画面幅に関わらず文字同士の重なり・被りを完全に防止する。
