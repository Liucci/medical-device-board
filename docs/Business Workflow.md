1,ユーザー登録
    ・施設ごとの初回のユーザー登録は運営側が施設の管理者（admin）を登録する
    ・初回登録に必要な情報はEmailとpassと施設名
    ・初回登録は専用のページがありsystem adminだけが遷移可能
２，ユーザー紹介
    ・施設ごとの2人目以降の登録は、初回ユーザーが招待することで登録可能
    ・招待時には招待先のemailと権限をnormalとadminから選択できる
    ・メールを自動送信するのはresendを使う
３，loginに必要な情報
    ・emailとpass

４，dashboardの構成
    ・大きく3つのエリア構成
    ・病棟エリア、ストックエリア、ボタンパネル
    ・病棟エリアとストックエリア右上部には機器アイコン拡大縮小スライド
    ・病棟エリアとストックエリアの境界はドラッグ可能
    ・各エリアは上下左右スクロール可能
    ・病棟エリアとストックエリアはgrid管理
    ・drag時は座標管理、Drag専用のlayerを持つ
５，buttonPanelの構造
    ・機器登録、履歴、設定、一覧、終了のボタンがある
    ・パネル下部にユーザー情報表示
６，病棟エリアの構造
    ・病棟内の病室に配置している医療機器を表示する
    ・病室に機器アイコンを最大6個まで追加可能
    ・病棟内に病室コンテナが表示され、病室コンテナ内に機器アイコンが配置される。
    ・機器アイコンクリックで、患者名、管理番号、シリアル、備考編集可能、レンタルまたは代替機の場合は返却日編集可能、メンテナンスタスク実施可能
    ・
７，ストックエリアの構造
    ・ストックエリア内の機器アイコンをクリックで管理番号、シリアル、備考編集、保守開始、解除できるmodalが開く。レンタルまたは代替機の場合は返却日編集可能
    ・
８，新規機器登録
    ・新規登録時はストックエリアのCE室に格納される
    ・登録と同時に機種や型式に対応したメンテナンスタスクが発生する

９，機器アイコン表示内容
    ・機種名、型式、管理番号、シリアル、レンタル機、代替機、機器運用状況インジケータ
    ・色別で機種を表示
１０，アイコン移動
    ・アイコン長押しでドラッグ開始
    ・通常クリックで各エリアに対応したmodalが開く
    ・ストックエリアから病棟エリアにドロップで病室を指定できるmodalが開く
    ・病室から病室にドロップすると部屋移動用modalが開く
    ・病室からストックエリアへdorpすると機器情報と患者情報がリセットされる
    ・ストックエリアからストックエリアへdropした場合は、配置先が変わるだけ
１１，機器情報編集
    ・アイコンを通常クリックすると機器情報を編集可能なmodalが開く
１２，設定ボタン
    ・機種、型番、病棟、病室、ストックエリア、メンテナンスタスクの編集が可能
１３，履歴ボタン
    ・すべての機器アイコンの操作履歴が表示される
    ・操作履歴をCSVやPDFで出力できる
１４，機器一覧ボタン
    ・登録中の機器アイコンの詳細一覧が表示
    ・CSVとPDF出力できる
１５，logoutボタン
    ・logoutするボタン
１６，機器残数表示
    ・型式ごとの機器在庫数を表示
    ・型式ごと残数が2台を下回ったとき、該当の型式の残数項目が赤くなる
１７、画面縮小拡大
    ・病棟エリアまたはストックエリアに配置している機器アイコンを拡大縮小できる
１８、

19. メンテナンスタスク

・機器アイコンを病棟へ配置した際、該当機器に紐づく maintenance type を元に maintenance task を自動生成する
・task の期限(due_at)は maintenance type の interval_days から算出する
・機器詳細modalには該当機器の maintenance task 一覧を表示する
・task の実施ボタン押下時、completed_at と completed_by を記録する
・warning_days 以内になると機器アイコンのメンテナンス警告インジケータを点灯する
・機器を病棟から stock area に戻した場合、未完了 task を削除する
・機器を削除した場合、関連する maintenance task を削除する
・maintenance task の直接作成・編集は行わない
・maintenance task はシステムが自動生成・自動削除する

# Device History

## Purpose

機器操作履歴を永続保存する。

履歴は監査ログとして扱い、原則削除しない。

関連する Device・User・Hospital が削除された場合でも履歴は保持する。

---

## History Record Timing

以下の操作実行時に device_histories へ記録する。

### Device

* 機器追加
* 機器削除
* 機器を病室へ移動
* 機器をStock Areaへ移動

### Device Information

* 管理番号変更
* シリアル番号変更
* 備考変更

### Room

* 患者名入力
* 患者名変更

### Maintenance

* 保守開始
* 保守終了

### Standby

* スタンバイ開始
* スタンバイ終了

---

## Action Type Definition

action_type は以下の値を使用する。

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

---

## Stored Snapshot Information

履歴には操作時点の情報を保存する。

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

これにより元データが削除された場合でも履歴内容を参照できる。

---

## Design Rule

History作成は Transaction Layer の責務とする。

CRUD Layer で History を追加してはならない。

例

```text
move_device_transaction
↓
update_device
↓
add_device_history
```

```text
delete_device_transaction
↓
add_device_history
↓
delete_device
```

```text
start_maintenance_transaction
↓
update_device
↓
add_device_history
```
