# Touch Drag Refactoring

## 概要

ドラッグ＆ドロップ処理をタッチパネル対応するため、ドラッグ処理全体をリファクタリングした。

目的は

* PC
* Android
* iPhone
* Surface

で共通ロジックで動作させること。

---

# 問題

従来は

* StockArea
* WardArea

それぞれの `onPointerUp` でドロップ処理を行っていた。

```
StockArea
    onPointerUp
        ↓
handleDropToStock()

WardArea
    onPointerUp
        ↓
handleDropToWard()
```

PCでは正常だったが、スマートフォンでは

* StockからRoomへドラッグしてもStockAreaへPointerUpが届く
* RoomからStockへドラッグしてもWardAreaへPointerUpが届く

という問題が発生。

PointerUpが「指を離した場所」ではなく、「ドラッグ開始したArea」で発火していた。

---

# 採用した設計

Area側でDrop判定する方式を廃止。

page.tsxだけでDrop判定を行うよう変更。

```
PointerUp
        ↓
page.tsx
        ↓
document.elementFromPoint()
        ↓
getDropTarget()
        ↓
handleDropToWard()
または
handleDropToStock()
```

これにより、PointerUpがどこで発火したかではなく、

**実際に指を離した座標**

からDrop先を判定する方式へ変更。

---

# dragフォルダ作成

ドラッグ処理を機能ごとに分離。

```
drag/
├── useDrag.ts
├── longPress.ts
├── autoScroll.ts
└── drop.ts
```

## useDrag.ts

管理

* draggingDevice
* isDragging
* mousePos
* dragOffset

関数

* startDrag()
* updateMousePos()
* endDrag()

ドラッグ状態管理を集約。

---

## longPress.ts

長押し判定のみ担当。

管理

* timer
* isLongPress

関数

* createLongPressState()
* startLongPress()
* finishLongPress()
* cancelLongPress()

Stock.tsxとRoomContainer.tsxの重複コードを削除。

---

## autoScroll.ts

スクロール処理を分離。

* autoScroll()
* isInside()

---

## drop.ts

Drop先判定を担当。

```
document.elementFromPoint()
```

と

```
data-ward-id
data-stock-area-id
```

を利用してDrop先を判定。

---

# data属性追加

WardArea

```
data-ward-id={ward.id}
```

StockArea

```
data-stock-area-id={area.id}
```

を追加。

drop.tsからDOM検索可能になった。

---

# DragLayer

DragLayerは描画のみ担当。

ロジックは保持しない。

役割を

```
drag/
```

ではなく

```
components/
```

へ残した。

---

# isDraggingRef廃止

従来

```
isDraggingRef.current
```

を利用していた。

リファクタリング後は

```
isDragging
```

(state)

へ統一。

用途

* DragLayer表示
* クリック無効
* 詳細Modal抑止

---

# 二重Drop問題

page.tsxへDrop処理を移した際、

さらに

* StockArea
* WardArea

にもonPointerUpが残っていたため、

```
page
↓

handleDrop()

StockArea
↓

handleDrop()
```

となり、

APIが二重送信されていた。

症状

* move_room_to_stock が2回実行
* move_stock_to_stock が2回実行
* fetch_current_user が2回実行
* httpx.ReadError
* 500 Internal Server Error

原因はDrop処理の二重実行。

対策として

Area側のonPointerUpを削除し、

Drop処理をpage.tsxへ一本化。

---

# 最終構成

```
PointerDown
        ↓
longPress.ts
        ↓
useDrag.startDrag()
        ↓
DragLayer描画
        ↓
PointerMove
        ↓
updateMousePos()
        ↓
PointerUp
        ↓
drop.ts
        ↓
handleDropToWard()
または
handleDropToStock()
        ↓
useDrag.endDrag()
```

---

# 結果

以下で正常動作を確認。

* PC
* Androidタッチパネル

確認項目

* Stock → Room
* Room → Room
* Room → Stock
* Stock → Stock

すべて正常。

短押し

→ 詳細Modal

長押し

→ Drag開始

Drop

→ 移動Modal

も正常に動作。

ドラッグ処理をページ全体で一元管理できる構成となり、PC・スマートフォン共通のドラッグロジックへ移行完了。
