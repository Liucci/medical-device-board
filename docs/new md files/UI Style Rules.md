# UI Design Standard

## 基準UI

`InspectionResultListModal` のデザインを、本プロジェクトの Page / Modal の基本デザインとして採用する。

---

## 採用するデザイン

### 1. 全体

* 清潔感のあるシンプルで上品なデザイン
* 白を基本とし、背景に薄いグレーを使用
* 情報を白いカード単位で整理
* 適度な余白を確保
* 適度な角丸とShadowを使用
* 過度な装飾は使用しない

### 2. 背景

* Modal背景：`bg-gray-200`
* Page背景：`bg-gray-100` ～ `bg-gray-200`
* コンテンツ：`bg-white`

### 3. Card

```tsx
rounded-xl bg-white p-6 shadow-sm
```

Card同士は適度な間隔を空ける。

### 4. Modal

```tsx
rounded-2xl shadow-2xl
```

大きめのModalを基本とし、画面幅に応じてResponsiveにする。

### 5. タイトル

メインタイトル：

```tsx
text-xl font-bold text-gray-800
```

セクションタイトル：

```tsx
text-lg font-semibold text-gray-800
```

説明・補足：

```tsx
text-sm text-gray-500
```

### 6. Label

```tsx
text-xs font-medium text-gray-600
```

### 7. Input / Select

```tsx
rounded-lg
border border-gray-300
bg-white
px-3 py-2
text-sm text-gray-700
```

Focus時：

```tsx
focus:border-blue-500
focus:ring-2
focus:ring-blue-100
```

### 8. Button

通常：

```tsx
rounded-lg
bg-gray-100
text-gray-700
```

主要操作：

```tsx
rounded-lg
bg-blue-500
text-white
hover:bg-blue-600
```

削除などの危険操作：

```tsx
bg-red-50
text-red-600
hover:bg-red-100
```

### 9. List

一覧項目はCard風にする。

```tsx
rounded-xl
border border-gray-200
bg-white
p-4
```

Hover時：

```tsx
hover:border-gray-300
hover:bg-gray-50
hover:shadow-sm
```

### 10. Table

* 白いCard内に配置
* `rounded-lg`
* `border-gray-200`
* Headerは `bg-gray-50`
* Header文字は `text-gray-600`
* RowのHoverは `hover:bg-gray-50`

### 11. 色

基本カラーは以下とする。

| 用途     | 色                   |
| ------ | ------------------- |
| 背景     | Gray                |
| Card   | White               |
| 通常文字   | Gray-800            |
| 補足文字   | Gray-500            |
| Border | Gray-200 ～ Gray-300 |
| 通常操作   | Gray                |
| 主要操作   | Blue                |
| 危険操作   | Red                 |

---

## UIの基本思想

**「シンプル・清潔・上品・視認性が高い」**

を基本とする。

医療システムとしての操作性を損なわず、
白いCard、薄いGray、適度な角丸、Shadow、余白によってリッチ感を出す。

今後のPage / ModalのUI変更では、原則としてこのデザインを基準とする。
