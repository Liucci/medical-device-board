# Authentication

## Purpose

本ドキュメントは、本プロジェクトの認証・認可・ユーザー管理の設計を定義する。

対象

- ログイン
- ログアウト
- JWT
- Refresh Token
- 招待
- 初回管理者登録
- 権限制御
- AuthContext
- public.users
- auth.users

---

# Authentication Architecture

```
Frontend

↓

FastAPI

↓

Supabase Auth

↓

public.users
```

Supabase Auth が認証を担当し、

public.users がアプリケーション固有情報を管理する。

---

# User Tables

## auth.users

Supabase管理

役割

- Email
- Password
- JWT
- Session
- Refresh Token

アプリケーションから直接参照しない。

---

## public.users

アプリケーション管理

```
id

hospital_id

email

display_name

role

is_active
```

業務ロジックは

```
public.users
```

のみ参照する。

---

# User Roles

## system_admin

プラットフォーム管理者

権限

- Hospital作成
- 初回Admin招待
- 全施設参照
- システム管理

---

## support

サポート担当

権限

- 障害調査
- データ確認
- 保守

---

## admin

施設管理者

権限

- User招待
- Ward管理
- Room管理
- StockArea管理
- Device設定
- Maintenance設定

---

## normal

一般利用者

権限

- Device操作
- History作成
- Task実施

---

## viewer

閲覧専用

閲覧のみ可能。

---

# Login Flow

```
Email

Password

↓

Supabase Auth

↓

Access Token

Refresh Token

↓

fetchCurrentUser

↓

Dashboard
```

---

# AuthContext

責務

- ログイン状態保持
- currentUser保持
- restoreSession
- logout
- token管理

業務ロジックは禁止。

---

# Access Token

API通信時に利用する。

```
Authorization

Bearer xxxxx
```

---

# Refresh Token

Access Token失効時に利用する。

```
401

↓

refreshToken()

↓

POST /refresh-token

↓

新しいAccess Token

↓

Retry
```

---

# Refresh Rule

Backendが唯一のRefresh管理者となる。

Supabase Clientは

```
auto_refresh_token=False
```

とする。

二重Refreshは禁止。

---

# Refresh Promise

複数Refreshを防止する。

```
refreshPromise

↓

Refresh中

↓

他リクエスト待機
```

同時Refreshは禁止。

---

# Restore Session

アプリ起動時

```
localStorage

↓

Access Token確認

↓

current-user取得

↓

Dashboard
```

---

# Login Response

利用する値

```
response.user.id

response.session.access_token

response.session.refresh_token
```

その他は利用しない。

---

# Authorization

Routeで

```
currentUser
```

取得後

role確認を行う。

CRUDでは認可しない。

---

# Invite Flow

```
Admin

↓

Invite作成

↓

invite_codes

↓

メール送信

↓

/register

↓

register_user_transaction

↓

auth.users

↓

public.users

↓

invite.used=true
```

---

# First Admin Flow

```
System Admin

↓

Hospital名入力

Email入力

↓

招待コード作成

↓

メール送信

↓

/first-admin-register

↓

Password設定

↓

Hospital作成

↓

auth.users

↓

public.users

↓

登録完了
```

---

# Invite Code

保持項目

```
code

email

role

hospital_id

expires_at

used
```

初回管理者登録のみ

```
hospital_id=NULL
```

を許可する。

---

# Permission Rule

認可判定は

```
Route

または

Transaction
```

で実施する。

CRUDは禁止。

---

# JWT

利用するClaim

```
sub

email

exp

iat

session_id
```

JWTからroleは取得しない。

---

# Current User

ログイン後は

```
public.users
```

から取得する。

取得項目

```
hospital_id

display_name

role

is_active
```

---

# Token Storage

Frontend

```
localStorage
```

保存

```
access_token

refresh_token
```

---

# Logout

削除

```
access_token

refresh_token
```

AuthContext初期化

↓

Login画面

---

# Authentication Test

認証確認ページ

```
/test-auth
```

確認項目

- Login
- Refresh
- Retry
- current-user
- Token削除
- Token期限切れ

---

# Error Rule

401

認証失敗

400

入力エラー

403

権限なし

500

サーバエラー

---

# Security Rule

Frontendは

```
hospital_id

created_by

updated_by
```

を送信しない。

Backendが設定する。

---

# Goal

認証と認可を完全に分離し、

Supabase Authは認証、

public.usersは業務権限

という責務を徹底する。

# Supabase Client の運用ルール

## 背景

本プロジェクトでは、当初 `supabase_client.py` を1つだけ使用していた。

```text
supabase_client.py
    ↓
・login
・CRUD
・Transaction
・auth.admin
```

しかし、この構成では重大な問題が発生した。

---

## 発生した問題

`supabase.auth.sign_in_with_password()` を実行すると、その `supabase` インスタンス内部にログインユーザーのセッション（Access Token）が保持される。

そのため、同じ `supabase` インスタンスを利用して

```python
supabase.auth.admin.update_user_by_id(...)
```

や

```python
supabase.table(...)
```

を実行すると、Service Role Key ではなくログインユーザー（Anon認証）の権限で実行される場合がある。

その結果、

* `User not allowed`
* `new row violates row-level security policy`
* `403 Forbidden`

などのエラーが発生する。

FastAPI を再起動すると正常に動作することからも、`supabase` インスタンス内の認証状態が上書きされていたことが確認できた。

---

## 原因

1. `supabase_admin` は Service Role Key で生成される。
2. 同じインスタンスで `sign_in_with_password()` を実行する。
3. SDK が内部にログインユーザーのセッションを保持する。
4. 以降の管理者API・CRUD処理にもその認証状態が影響する。

つまり、**同一の Supabase Client を「認証」と「管理者処理」で共有してはいけない。**

---

## 対策

Supabase Client を用途ごとに分離する。

```text
common
├── supabase_admin_client.py
└── supabase_auth_client.py
```

### supabase_admin_client.py

使用するキー

* SUPABASE_SERVICE_ROLE_KEY

用途

* CRUD
* Transaction
* auth.admin.*
* システム管理処理

認証API（`sign_in_with_password()` など）は使用しない。

---

### supabase_auth_client.py

使用するキー

* NEXT_PUBLIC_SUPABASE_ANON_KEY

用途

* sign_in_with_password()
* sign_out()
* get_user()
* refresh_session()

DB更新・CRUD・auth.admin.* は使用しない。

---

## 運用ルール

* `login.py` は `supabase_auth_client.py` を使用する。
* `get_auth_user_id.py` など認証系APIは `supabase_auth_client.py` を使用する。
* CRUD・Transaction・auth.admin.* は必ず `supabase_admin_client.py` を使用する。
* 認証処理と管理者処理で同じ Supabase Client を共有しない。

---

## この構成を採用する理由

認証用クライアントと管理者用クライアントを分離することで、

* Service Role Key が一般ユーザーの認証状態で上書きされることを防止できる。
* `User not allowed` や RLS エラーの再発を防げる。
* 認証処理と管理者処理の責務が明確になり、保守性が向上する。



Supabase Client が勝手にリフレッシュする
独自の /refresh-token でもリフレッシュする

という二重管理は避けるべきです。

したがって、

ClientOptions(
    auto_refresh_token=False
)