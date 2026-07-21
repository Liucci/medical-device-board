# RLS Development Rules

## 目的

SupabaseのRLS(Row Level Security)による不具合を切り分けやすくし、
CRUDおよびRealtime機能を効率よく開発するためのルール。

---

# 基本方針

新しいDBアクセス機能を実装する場合は、

1. テーブル作成
2. RLS有効化
3. 開発用ALL Allow Policy設定
4. CRUD実装
5. Realtime動作確認
6. 本番用RLSへ変更
7. CRUD・Realtime再確認

の順番で実装する。

---

# 1. テーブル作成

- Primary Key設定
- 外部キー設定
- 必要なIndex作成
- Realtime対象ならPublicationへ追加
- RLS有効化

```sql
ALTER TABLE <table_name>
ENABLE ROW LEVEL SECURITY;
```

---

# 2. 開発中

権限制御は一旦考えず、
認証済みユーザー(authenticated)に全権限を許可する。

対象

- SELECT
- INSERT
- UPDATE
- DELETE

これにより

- CRUD確認
- Front/Back動作確認
- Realtime確認

をRLSの影響なく実施できる。

---

# 3. 機能完成後

運用仕様に従いRLSを設定する。

例

| 操作 | system_admin | admin | normal | viewer |
|------|--------------|-------|--------|--------|
| SELECT | ○ | ○ | ○ | ○ |
| INSERT | ○ | × | × | × |
| UPDATE | ○ | × | × | × |
| DELETE | ○ | × | × | × |

※ テーブルごとに必要な権限へ変更する。

---

# 4. Realtime利用時

Realtimeを利用するテーブルでは
SELECTポリシーも必ず作成する。

RealtimeはRLSのSELECTポリシーの影響を受けるため、

SELECTポリシーが無い場合、

- CRUDは成功する
- DB更新も成功する
- Realtimeだけ動作しない

という現象が発生する。

今回のannouncementsテーブルがこれに該当した。

---

# 5. 完成後チェック

RLS変更後は必ず確認する。

□ SELECT

□ INSERT

□ UPDATE

□ DELETE

□ Realtime

---

# 今回の教訓

announcementsテーブルでは

- INSERT
- UPDATE
- DELETE

のRLSのみ設定されており、

SELECTポリシーが存在しなかった。

その結果、

- CRUDは正常
- DB更新も正常
- Realtimeだけ同期しない

という現象が発生した。

SELECTポリシー追加後、

Realtimeは正常に動作した。

---

# 開発チェックリスト

新しいDBアクセス機能を作成したら確認する。

□ Primary Key

□ Publication登録（Realtime利用時）

□ RLS有効

□ 開発用ALL Allow Policy

□ CRUD動作確認

□ Realtime確認

□ 本番RLS設定

□ CRUD再確認

□ Realtime再確認