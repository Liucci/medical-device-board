# デプロイ関連メモ

## 構成

### Frontend

* Next.js
* Render
* 本番URL

  * https://devix.jp

### Backend

* FastAPI
* Render
* URL

  * https://medical-device-board-api.onrender.com

### DB

* Supabase

---

# Render

## Frontend

### Build Command

```bash
npm install
npm run build
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PROD_API_URL=https://medical-device-board-api.onrender.com
```

---

## Backend

### Start Command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables

* SUPABASE_URL
* SUPABASE_SERVICE_ROLE_KEY
* RESEND_API_KEY
* FRONTEND_URL
* JWT_SECRET_KEY

---

# 独自ドメイン

## Frontend

### Render Custom Domain

* devix.jp
* [www.devix.jp](http://www.devix.jp)

### お名前.com DNS

#### Aレコード

| ホスト | TYPE | VALUE       |
| --- | ---- | ----------- |
| 空欄  | A    | 216.24.57.1 |

#### CNAME

| ホスト | TYPE  | VALUE                                      |
| --- | ----- | ------------------------------------------ |
| www | CNAME | medical-device-board-frontend.onrender.com |

---

## Backend

独自ドメイン未使用

使用URL

```text
https://medical-device-board-api.onrender.com
```

カスタムドメイン数制限のため未設定。

---

# Next.js 16対応

## useSearchParamsエラー

エラー

```text
useSearchParams() should be wrapped in a suspense boundary
```

### 対応方針

page.tsxで searchParams を取得し、Client Componentへ propsで渡す。

### NG

```tsx
"use client"

const searchParams = useSearchParams()
const code = searchParams.get("code")
```

### OK

page.tsx

```tsx
type PageProps = {
  searchParams: Promise<{
    code?: string
  }>
}

export default async function Page({
  searchParams
}: PageProps) {

  const params = await searchParams

  return (
    <RegisterClient
      code={params.code ?? ""}
    />
  )
}
```

RegisterClient.tsx

```tsx
"use client"

type Props = {
  code: string
}

export default function RegisterClient({
  code
}: Props) {

}
```

適用箇所

* register
* first-admin-register

---

# CORS

許可

```python
allow_origins = [
    "http://localhost:3000",
    "https://devix.jp",
    "https://www.devix.jp"
]
```

---

# .env.local

Git管理対象外。

Render側の Environment Variables を別途設定する。

ローカルの変更は本番へ自動反映されない。

---

# 本番URL

Frontend

```text
https://devix.jp
```

Backend

```text
https://medical-device-board-api.onrender.com
```

---

# デモ前重点確認

## 認証

* login
* logout
* refresh token
* current-user

## 招待

* create invite
* register
* first admin register

## マスタ

* device type
* device model
* room

## トランザクション

* create
* update
* delete

## 出力

* CSV
* PDF

---

# よくある不具合

## loginできない

原因

```text
NEXT_PUBLIC_PROD_API_URLがdevix.jpになっていた
```

対応

```env
NEXT_PUBLIC_PROD_API_URL=https://medical-device-board-api.onrender.com
```

Render側のEnvironment Variables変更後、再デプロイする。

---

## useSearchParamsエラー

page.tsxで取得し、props経由で渡す。

---

## CORSエラー

実際には500エラーが発生している場合がある。

Render backendログを確認する。

---

## .env.local変更が反映されない

原因

```text
.env.local は gitignore 対象
```

対応

Render Environment Variables を修正し再デプロイする。
