# Business Workflow

## 1. ユーザー登録

### 1.1 初回ユーザー登録

・施設ごとの初回ユーザー登録は運営側が実施する
・施設管理者（admin）を登録する
・登録情報は Email / Password / 施設名
・初回登録ページは system admin のみ利用可能

### 1.2 ユーザー招待

・施設ごとの2人目以降は招待で登録する
・招待時に権限（admin / normal）を選択する
・招待メール送信には Resend を利用する

---

## 2. ログイン

・Email と Password を利用する

---

## 3. ダッシュボード

### 3.1 画面構成

・病棟エリア
・ストックエリア
・ボタンパネル

### 3.2 共通仕様

・病棟エリアとストックエリアは Grid 管理
・境界はドラッグで変更可能
・各エリアは上下左右スクロール可能
・Drag 専用 Layer を持つ
・機器アイコンの拡大縮小が可能

---

## 4. ボタンパネル

・機器登録
・履歴
・設定
・一覧
・ログアウト

・パネル下部にユーザー情報を表示する

---

## 5. 病棟エリア

### 5.1 病室表示

・病棟内に病室コンテナを表示する
・病室ごとに最大6台の機器を配置可能
・病室内の機器アイコンが０台になった時、患者情報をリセット
### 5.2 機器操作

・患者名編集
・管理番号編集
・シリアル編集
・備考編集
・返却日編集（レンタル機／代替機）
・メンテナンスタスク実施

---

## 6. ストックエリア

### 6.1 ストック表示

・ストックエリア内に機器を配置する

### 6.2 機器操作

・管理番号編集
・シリアル編集
・備考編集
・保守開始
・保守終了
・返却日編集（レンタル機／代替機）

---

## 7. 機器登録

・新規登録時は CE 室へ配置する
・登録時に対応する Maintenance Task を生成しない
・病棟配置時にmaintenance taskが作成される

---

## 8. 機器アイコン

### 8.1 表示内容

・機種名
・型式名
・管理番号
・シリアル番号
・レンタル機フラグ
・代替機フラグ
・運用状態インジケータ

### 8.2 表示ルール

・機種ごとに色分けする

---

## 9. 機器移動

### 9.1 ドラッグ操作

・長押しでドラッグ開始

### 9.2 ストック → 病棟

・配置先病室を選択する

### 9.3 病棟 → 病棟

・移動先病室を選択する
・移動先が同患者なら、機器情報は引き継がれる。
・移動先が別患者では機器情報はリセットされる。

### 9.4 病棟 → ストック

・患者情報をリセットする
・病室情報をリセットする
・タスクをリセットする

### 9.5 ストック → ストック

・配置位置のみ変更する

---

## 10. 機器情報編集

・アイコン選択時に以下の機器詳細 Modal を表示する
・ストックエリア配置時は管理番号、シリアル編集、備考編集可能なmodalが開く
・病棟エリア配置時は患者名、管理番号、シリアル、備考、返却期限、スタンバイ開始解除できるmodalが開く

---

## 11. 設定

・機種管理
・型式管理
・病棟管理
・病室管理
・ストックエリア管理
・メンテナンスタイプ管理

---

## 12. 履歴

### 12.1 画面機能

・全履歴表示
・様々な条件で検索可能
・CSV 出力
・PDF 出力

### 12.2 記録対象

#### Device

・機器追加
・機器削除
・病室移動
・ストック移動

#### Device Information

・管理番号変更
・シリアル変更
・備考変更

#### Room

・患者名登録
・患者名変更

#### Maintenance

・保守開始
・保守終了

#### Standby

・スタンバイ開始
・スタンバイ終了

### 12.3 Action Type

```text
device_created
device_deleted

moved_to_room
moved_to_stock

management_number_updated
serial_number_updated
note_updated

patient_name_updated

maintenance_started
maintenance_finished

standby_started
standby_finished
```

### 12.4 Snapshot

```text
device_type_name
device_model_name
room_name
stock_area_name
patient_name
management_number
serial_number
note
```

### 12.5 実装ルール

・History 作成は Transaction Layer の責務とする
・CRUD Layer から History を生成してはならない

---

## 13. 機器一覧

・全機器一覧表示
・様々な条件で検索可能
・CSV 出力
・PDF 出力

---

## 14. 機器残数表示

・型式ごとの在庫数を表示する
・残数が2台未満の場合は赤色表示する

---

## 15. メンテナンスタスク

### 15.1 生成ルール

・病棟配置時に自動生成する
・Maintenance Type を元に生成する
・due_at は interval_days から算出する

### 15.2 実施

・機器詳細 Modal から実施可能
・completed_at を記録する
・completed_by を記録する

### 15.3 警告

・warning_days 以内で警告表示する
・機器アイコンに警告インジケータを表示する

### 15.4 削除ルール

・病棟から Stock Area に戻した場合は未完了 Task を削除する
・機器削除時は関連 Task を削除する

### 15.5 管理方針

・Maintenance Task の手動作成は行わない
・Maintenance Task の手動編集は行わない
・システムが自動生成・自動削除する

① room → room の業務ルール

room → room は患者移動を表す。

同患者の場合
・機器はそのまま移動
・管理番号維持
・シリアル維持
・備考維持
・task維持

別患者の場合
・新規患者への使用開始とみなす
・管理番号クリア
・シリアルクリア
・備考クリア
・task削除後再生成


② 病室患者名のルール
患者が別病室へ移動した場合

移動元病室の patient_name はクリアする。

患者情報は病室に紐付く。

③ room → room の Front 判定ルール

同患者判定は Frontend が行う。

samePatient = true
↓
move_room_to_room

samePatient = false
↓
move_room_to_room_new_patient

④ 機器詳細情報リセット対象
患者変更時にリセットする項目

management_number
serial_number
note

上記は患者固有情報として扱う。

⑤ task運用ルール
患者変更時

既存taskを削除
↓
maintenance_typesから再生成

同患者移動ではtask維持

### 12.6 History Design Rule

History は過去時点の Snapshot を保持する。

履歴表示で利用するため、以下の情報は履歴作成時点の値を保存する。

```text
device_type_name
device_model_name

room_name
stock_area_name

patient_name

management_number
serial_number
note
```

ID参照による復元は行わない。

```text
room_id
stock_area_id
```

は保持しない。

理由

・Room名変更後も当時の履歴を正しく表示するため
・StockArea名変更後も当時の履歴を正しく表示するため
・履歴単体で内容を理解できるようにするため

---

### 12.7 Maintenance Task History Rule

Maintenance Task 実施時は Device History を作成する。

```text
action_type

maintenance_task_completed
```

```text
message

Maintenance Type 名
```

例

```text
action_type
maintenance_task_completed

message
輸液ポンプ点検
```

実施日時は

```text
created_at
```

を利用する。

実施者は

```text
action_by
```

を利用する。

Maintenance Task 専用の履歴カラムは追加しない。


# 初回管理者登録機能

## 基本思想

一般ユーザー登録と初回管理者登録は別フローとする。

register_user_transaction 内で role による分岐は行わない。

* register_user_transaction
* register_first_admin_transaction

を分離する。

Page も共通化せず、

* /register
* /first-admin-register

を別 page とする。

入力項目のみ共通とする。

初回管理者登録画面の入力項目

* display_name
* password

招待時の入力項目

* hospital_name
* email

system_admin は display_name を入力しない。

## 処理フロー

system_admin login
↓
/first-admin-invite
↓
hospital_name,email入力
↓
invite_first_admin_transaction
↓
create_first_admin_invite_code
↓
invite_codes table にレコード作成
↓
メール送信
↓
first admin がメール内 URL をクリック
↓
/first-admin-register?code=xxxx
↓
display_name,password入力
↓
register_first_admin_transaction
↓
hospital作成
↓
auth user作成
↓
users table登録
↓
invite_code.used=true
↓
登録完了
↓
login page

## invite_codes table

一般ユーザー招待と初回管理者招待で共通テーブルを使用する。

追加項目

* hospital_name

hospital_id は nullable とする。

初回管理者招待時点では hospital が存在しないため、

hospital_id=NULL
hospital_name=〇〇病院

として保存する。

register_first_admin_transaction 内で hospital を作成し、
その hospital_id を users table に設定する。

## URL

一般ユーザー

/register?code=xxxx

初回管理者

/first-admin-register?code=xxxx

を使用する。

## system_admin

system_admin 用 hospital を1つ用意する。

例

hospital_name
Devix System

system_admin は全員この hospital に所属させる。

hospital.id は通常 hospital と同じ UUID を使用する。

特殊文字列は使用しない。

## API

POST /invite-first-admin

system_admin のみ実行可能。

入力

{
hospital_name,
email
}

処理

invite_first_admin_transaction

POST /register-first-admin

入力

{
code,
display_name,
password
}

処理

register_first_admin_transaction

## Front構成

page
↓
transaction
↓
mapper
↓
CRUD(fetch)
↓
backend

mapper が camelCase ⇔ snake_case の変換を担当する。

CRUD 層では変換しない。

CRUD は RequestDB type を受け取る。

transaction は必ず type と mapper を利用する。

import は1行で記述する。

引数1個の関数呼び出しは改行しない。

不要な空行を作らない。


9.6 Drag Event Rule

drag状態管理は useRef を利用する。

isDraggingRef.current = true
↓
drag開始

handleMouseUp終了後
↓
isDraggingRef.current = false

drag中は機器詳細Modalを開かない。

RoomContainer
Stock

if (isDraggingRef.current) return