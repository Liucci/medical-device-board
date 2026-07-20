# お知らせ機能 実装メモ

## 目的

運営管理者がお知らせを病院へ配信する機能。

### 配信方法

-   ダッシュボード上部に電光掲示板のように右から左へスクロール表示
-   Resendを利用した一斉メール送信（今後実装）

## DB設計

### announcements

-   id
-   message
-   start_at
-   end_at
-   is_active
-   created_at
-   updated_at

### announcement_hospitals

-   announcement_id
-   hospital_id

複数病院配信に対応するため中間テーブルを採用。

## Backend

### Schema

-   1APIにつき1Schema
-   CRUD用Schemaも同一ファイルに定義

### CRUD

announcements - fetch - add - update

announcement_hospitals - fetch - add - delete

### Transaction

Create 1. announcement登録 2. announcement_id取得 3. hospital_idsループ
4. announcement_hospitals登録

Update 1. announcement更新 2. announcement_hospitals削除 3. 再登録

Fetch 1. announcements取得 2. announcement_hospitals取得 3.
hospital_ids付与

## Frontend

### API

-   fetchAnnouncements
-   createAnnouncement
-   updateAnnouncement

### Transaction

-   fetchAnnouncementsTransaction
-   createAnnouncementTransaction
-   updateAnnouncementTransaction

TransactionがAPI・Mapper・State更新を担当。

## 画面構成

announcement-management

-   page.tsx
-   AnnouncementSearch.tsx
-   AnnouncementTable.tsx
-   CreateAnnouncementModal.tsx
-   UpdateAnnouncementModal.tsx
-   HospitalCheckList.tsx

## HospitalCheckList仕様

-   全病院チェック
-   個別病院チェック
-   全病院選択時は個別選択を無効化

## 検索

-   お知らせ内容
-   配信状態
-   開始日
-   終了日

## 実装済み

-   DB
-   Backend
-   Frontend
-   一覧画面
-   検索UI
-   Create/Update Modal
-   HospitalCheckList
-   病院一覧表示

## 次回

1.  登録確認
2.  更新確認
3.  announcement_hospitals確認
4.  Dashboard電光掲示板表示
5.  Resend一斉送信
