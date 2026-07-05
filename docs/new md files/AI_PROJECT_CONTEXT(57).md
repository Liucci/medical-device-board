# AI_PROJECT_CONTEXT

## Purpose

本ドキュメントは、本プロジェクト全体を理解するための入口となる設計書である。

新規開発・保守・AIによるコード生成・リファクタリングを行う場合は、必ず本書から読み始めること。

本プロジェクトでは、設計情報を役割ごとに分離し、同じ内容を複数のドキュメントへ記載しないことを原則とする。

---

# Read Order

以下の順番で参照すること。

## 1. Coding Rules.md

コーディング規約

内容

- 命名規則
- Formatterルール
- Mapperルール
- Loggingルール
- Loadingルール
- Dragルール
- 実装ルール

---

## 2. Architecture.md

システム全体の設計思想

内容

- Backend Architecture
- Frontend Architecture
- Layer責務
- 実装順序
- CRUD
- Transaction
- Route
- Mapper
- Types
- Fetch
- UI責務
- Exists Pattern
- 標準実装パターン

---

## 3. Data Model.md

データモデル

内容

- ER
- Table Relations
- Supabase Schema
- 全Table定義
- Schema一覧
- Snapshot設計
- Dashboard Initial Data構造

---

## 4. Authentication.md

認証・認可設計

内容

- Auth Flow
- Login
- Register
- Invite
- First Admin
- Role
- Refresh Token
- AuthContext
- JWT
- public.users
- auth.users
- 認証デバッグ
- 権限制御

---

## 5. API Specification.md

Frontend・Backend契約

内容

- Route一覧
- Request Schema
- Response Schema
- Dashboard API
- Export API
- Auth API
- Transaction API

---

## 6. Business Workflow.md

本アプリ固有の業務仕様

内容

- 機器運用
- 病棟運用
- 患者運用
- メンテナンス
- 履歴
- タスク
- 感染症
- Realtime
- Export
- Dashboard動作
- UI仕様

---

## 7. File Tree.md

プロジェクト構成

内容

- Backend
- Frontend
- Directory構成
- 主要ファイル

---

## 8. Deployment.md

デプロイ

内容

- Render
- Supabase
- Environment Variables
- CORS
- Domain
- 本番運用

---

## 9. Export.md

帳票仕様

内容

- CSV
- PDF
- ReportLab
- Layout
- Footer
- Font
- Export Transaction

---

# Development Rule

新規機能追加時は以下の順番で設計を確認する。

1. Coding Rules
2. Architecture
3. Data Model
4. Authentication
5. API Specification
6. Business Workflow

その後実装を開始する。

---

# Documentation Rule

設計書は責務ごとに分離する。

## Coding Rules

実装ルールのみを記載する。

業務仕様を書かない。

---

## Architecture

システム構造のみを記載する。

業務仕様を書かない。

---

## Data Model

DB設計のみを記載する。

API仕様を書かない。

---

## Authentication

認証・認可のみを記載する。

業務仕様を書かない。

---

## API Specification

API契約のみを記載する。

設計思想を書かない。

---

## Business Workflow

業務仕様のみを記載する。

コードルールを書かない。

---

## File Tree

ディレクトリ構成のみを管理する。

---

## Deployment

デプロイ・環境構築のみを管理する。

---

## Export

CSV・PDF仕様のみを管理する。

---

# Maintenance Policy

新しい機能を追加する場合は、

既存ドキュメントへ追記することを優先する。

同じ内容を別ファイルへ重複して記載してはならない。

---

# Goal

本ドキュメント群のみで、

- システム構造
- データ構造
- 認証
- API
- 業務仕様
- 運用方法

を完全に理解できる状態を維持する。

AI・人間を問わず、本プロジェクトの唯一の公式設計書として利用する。