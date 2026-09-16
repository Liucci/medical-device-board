# 機器点検機能 要件定義

## 基本方針
- 点検表定義と点検履歴を分離する。
- マスター（device/model/type/ward/room等）は編集・削除可能。
- 点検履歴は実施時点のスナップショットとして保存し、マスター変更・削除の影響を受けない。

## inspection_checklists
- 「どの機種・機器種別・点検種類の点検表か」を定義。
- `device_type_id`、`device_model_id`、`inspection_type_id` は保持する。
- マスター変更時は点検表も追従する。
- マスター削除時、関連点検表があれば警告し、承認時に関連する点検表定義も削除する。

## inspections
- マスターIDは保持しない。
- 点検時点の以下を保存する。
  - `device_type_name`
  - `device_model_name`
  - `management_number`
  - `serial_number`
  - `ward_name`
  - `room_name`
  - `patient_name`
  - `inspection_type_name`
  - `checklist_name`
  - `performed_by_name`
  - `overall_result`
  - `comment`
  - `created_at`
- `hospital_id` と `id` は保持する。

## inspection_results
- `checklist_item_id` は保持しない。
- 点検時点の以下を保存する。
  - `inspection_id`
  - `category_name`
  - `category_display_order`
  - `item_name`
  - `item_display_order`
  - `unit`
  - `value`
- `inspection_id` のみ `inspections` と関連する。

## 履歴データ
- `inspections` / `inspection_results` は原則UPDATE・DELETEしない。
- 点検表定義も原則ADD・FETCHを基本とし、変更は新規追加で対応する。
