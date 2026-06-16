# Supabase Auth Login Response Memo

## Overview

Supabase Auth の sign_in_with_password() は以下を返す。

```python
response.user
response.session
```

---

# response.user

認証ユーザー情報。

## user.id

```text
auth.users の主キー
```

例

```text
b0c9d03a-59c3-490d-b5b3-5b7cf6fc66dc
```

アプリケーションでは

```text
public.users.id
```

と一致させる。

---

## user.email

ログインメールアドレス

例

```text
test@example.com
```

---

## user.role

Supabase Auth のロール

例

```text
authenticated
```

注意

```text
system_admin
admin
user
```

とは別物。

アプリケーション権限は

```text
public.users.role
```

で管理する。

---

## user.created_at

認証ユーザー作成日時

---

## user.last_sign_in_at

最終ログイン日時

---

## user.confirmed_at

メール認証日時

---

## user.app_metadata

認証プロバイダ情報

例

```json
{
  "provider": "email"
}
```

---

## user.user_metadata

ユーザー追加情報

例

```json
{
  "email_verified": true
}
```

---

# response.session

ログインセッション情報。

---

## session.access_token

JWTアクセストークン

用途

```text
Authorization: Bearer xxx
```

としてAPIへ送信する。

---

## session.refresh_token

アクセストークン再発行用トークン

用途

```text
POST /refresh-token
```

---

## session.expires_in

有効期限（秒）

例

```text
3600
```

1時間

---

## session.expires_at

トークン失効時刻

Unix Time

---

## session.token_type

通常

```text
bearer
```

---

# JWT Internal Claims

access_token を decode すると以下が含まれる。

## sub

```text
auth.users.id
```

ユーザーID

---

## email

ログインメールアドレス

---

## session_id

セッションID

---

## iat

発行時刻

---

## exp

失効時刻

---

# Application Usage

アプリケーションで実際に利用するのは主に以下。

```text
response.user.id

response.session.access_token

response.session.refresh_token
```

---

# Application User Profile

業務情報は Supabase Auth ではなく

```text
public.users
```

から取得する。

取得項目

```text
hospital_id
display_name
role
is_active
```

アプリケーションの認可判定は

```text
public.users.role
```

を利用する。
