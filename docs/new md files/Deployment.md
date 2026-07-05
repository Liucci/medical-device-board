# Deployment

## Purpose

本ドキュメントは、本システムの開発環境・本番環境・デプロイ手順・環境変数を定義する。

---

# System Configuration

```
Frontend

↓

Render

↓

Backend(FastAPI)

↓

Render

↓

Supabase(PostgreSQL)
```

---

# Production Environment

## Frontend

Framework

```
Next.js
```

Hosting

```
Render
```

Production URL

```
https://devix.jp
```

---

## Backend

Framework

```
FastAPI
```

Hosting

```
Render
```

Production URL

```
https://medical-device-board-api.onrender.com
```

---

## Database

```
Supabase
```

PostgreSQL

---

# Local Environment

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:8000
```

---

# Environment Variables

## Frontend

```
NEXT_PUBLIC_API_URL

NEXT_PUBLIC_PROD_API_URL
```

ローカルでは

```
NEXT_PUBLIC_API_URL
```

本番では

```
NEXT_PUBLIC_PROD_API_URL
```

を利用する。

---

## Backend

```
SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY

JWT_SECRET_KEY

RESEND_API_KEY

FRONTEND_URL
```

Backendのみ保持する。

Frontendへ公開しない。

---

# Render

## Frontend

Build

```
npm install

npm run build
```

---

## Backend

Start

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

# Domain

Frontend

```
https://devix.jp
```

Backend

```
https://medical-device-board-api.onrender.com
```

Backendは独自ドメインを使用しない。

---

# DNS

お名前.com

```
A Record

216.24.57.1
```

```
CNAME

medical-device-board-frontend.onrender.com
```

---

# CORS

許可Origin

```
http://localhost:3000

https://devix.jp

https://www.devix.jp
```

Backend側で設定する。

---

# Next.js Rules

useSearchParamsを直接使用しない。

```
page.tsx

↓

searchParams取得

↓

Client Componentへprops渡し
```

を採用する。

---

# .env Rule

```
.env.local
```

はGit管理しない。

Render側Environment Variablesを利用する。

---

# Deployment Flow

```
Git Push

↓

GitHub

↓

Render Build

↓

Deploy

↓

Production
```

---

# Release Checklist

## Authentication

- Login
- Logout
- Refresh Token
- Current User

---

## User

- Invite
- Register
- First Admin Register

---

## Master

- Ward
- Room
- Stock Area
- Device Type
- Device Model
- Maintenance Type
- Infection Type

---

## Transaction

- Create
- Update
- Delete
- Move

---

## Dashboard

- Initial Load
- Drag & Drop
- Realtime
- Last Updated

---

## Export

- History CSV
- History PDF
- Device CSV
- Device PDF

---

# Troubleshooting

## Loginできない

確認

```
NEXT_PUBLIC_PROD_API_URL
```

Backend URLになっているか。

---

## CORS Error

Backendログを確認する。

500エラーがCORSとして表示される場合がある。

---

## useSearchParams Error

Server Componentで取得し、

Client Componentへ渡す。

---

## Environment Variables

変更後は

```
Render

↓

Manual Deploy
```

を実施する。

---

## Supabase

確認項目

- URL
- Service Role Key
- RLS
- JWT設定

---

# Deployment Policy

本番環境の設定は

Render Environment Variables

を正とする。

ローカル設定との差異は必ず確認する。

---

# Goal

本ドキュメントのみで

- 開発環境
- 本番環境
- デプロイ
- ドメイン
- 環境変数
- リリース手順
- トラブルシューティング

を理解できる状態を維持する。