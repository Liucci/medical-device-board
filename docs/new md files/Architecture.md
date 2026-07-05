# Architecture

## Purpose

本ドキュメントは、本プロジェクトの実装ルールを定義する。

本プロジェクトでは、

- Backend
- Frontend
- Database

すべての新規実装を本書に従って行う。

本書はAI・人間ともに利用する公式実装ガイドである。

---

# Design Philosophy

最優先事項

- シンプル
- 単一責務
- 一貫性
- 保守性
- AIが迷わないこと

コード量よりも構造を優先する。

---

# Overall Architecture

```
Frontend

↓

Backend Route

↓

Transaction

↓

CRUD

↓

Supabase
```

すべての処理はこの構造を通る。

例外は作らない。

---

# Backend Architecture

```
Schema

↓

CRUD

↓

Transaction

↓

Route
```

---

## Schema

責務

- Request
- Response
- Validation

禁止

- DB操作
- Permission
- History
- Task

---

## CRUD

責務

単一Table操作のみ。

許可

- insert
- update
- delete
- select

禁止

- 複数Table更新
- History
- Task
- Permission
- Transaction

---

## Transaction

責務

業務ロジック

許可

- CRUD呼び出し
- Exists
- Permission
- History
- Task
- 状態遷移

Transactionだけが業務を知っている。

---

## Route

責務

API公開

流れ

```
Request

↓

Authentication

↓

CurrentUser

↓

Permission

↓

Transaction

↓

Response
```

RouteはDBを操作しない。

---

# Frontend Architecture

```
Types

↓

Mapper

↓

Fetch

↓

Transaction

↓

UI
```

---

## Types

責務

型定義のみ。

---

## Mapper

責務

変換のみ。

```
DB

↓

Frontend
```

```
Frontend

↓

Request
```

Mapperは業務ロジックを書かない。

---

## Fetch

責務

API通信のみ。

禁止

- State更新
- Modal制御

---

## Transaction

責務

画面更新

許可

- API呼び出し
- State更新
- Modal制御

禁止

Request生成

---

## UI

責務

画面表示

許可

- Input
- State
- Transaction呼び出し

禁止

API呼び出し

---

# Standard Development Flow

新規機能は必ず以下の順番で実装する。

Backend

```
① Schema

↓

② CRUD

↓

③ Transaction

↓

④ Route

↓

⑤ API確認
```

Frontend

```
⑥ Types

↓

⑦ Mapper

↓

⑧ Fetch

↓

⑨ Transaction

↓

⑩ UI

↓

⑪ 動作確認
```

---

# Master Creation Pattern

新しいMasterを追加する場合

Backend

```
Schema

CRUD

Transaction

Route
```

Frontend

```
Types

Mapper

Fetch

Transaction

Modal

Settings画面
```

---

# Transaction Creation Pattern

新しいTransactionを追加する場合

```
CRUD洗い出し

↓

History

↓

Task

↓

状態遷移

↓

Route

↓

Frontend Transaction

↓

Dashboard確認

↓

Realtime確認
```

---

# DB Column Addition Pattern

DBへ列追加時

```
Migration

↓

Schema

↓

DBType

↓

Mapper

↓

Frontend Type

↓

UI

↓

Export

↓

History
```

Transactionは原則修正しない。

---

# New API Pattern

```
Schema

↓

CRUD

↓

Transaction

↓

Route

↓

Fetch

↓

Frontend Transaction

↓

UI
```

---

# New Export Pattern

```
Export Schema

↓

Export Transaction

↓

PDF Generator

↓

Route

↓

Frontend Export
```

---

# New Realtime Pattern

```
対象Table決定

↓

Realtime追加

↓

Fetch追加

↓

State更新

↓

Dashboard確認
```

Backendは修正しない。

---

# Responsibility Rules

## Backend

業務を担当する。

---

## Frontend

表示を担当する。

---

## CRUD

DBだけを担当する。

---

## Transaction

業務だけを担当する。

---

## Mapper

変換だけを担当する。

---

## UI

画面だけを担当する。

---

# AI Implementation Checklist

新規実装時は必ず確認する。

## Backend

- □ Schema
- □ CRUD
- □ Transaction
- □ Route

## Frontend

- □ Types
- □ Mapper
- □ Fetch
- □ Transaction
- □ UI

## Common

- □ Dashboard
- □ History
- □ Task
- □ Realtime
- □ Export
- □ Permission
- □ Loading
- □ Error Handling

---

# Completion Checklist

以下がすべて完了したら実装完了とする。

- API動作確認
- Dashboard確認
- Realtime確認
- History確認
- Task確認
- Export確認
- 権限確認
- エラー確認

---

# Goal

AIが本書だけを読めば、

- どこにファイルを作るか
- 何から実装するか
- どの順番で作るか
- 何を確認するか

を迷わず実装できることを目的とする。

本書は本プロジェクトにおける唯一の実装ガイドラインとする。