# Auth Flow

## Overview

This application uses a multi-tenant structure based on hospitals.

Authentication is managed by Supabase Auth.

Application-specific user information is managed separately in the `public.users` table.

---

# Role Structure

## system_admin

Platform operator role.

Responsible for:

- create hospitals
- create initial hospital administrators
- manage platform-wide settings
- access dedicated admin pages
- manage system-level operations

---

## admin

Hospital administrator role.

Responsible for:

- invite users
- manage hospital settings
- manage device settings
- manage rooms and wards
- manage stock areas
- manage maintenance settings

---

## user

General hospital user role.

Responsible for:

- operate devices
- record device histories
- perform maintenance tasks
- view assigned hospital data

---

# Initial Hospital Setup Flow

## System Admin Flow

1. system_admin logs into dedicated admin page
2. system_admin creates hospital
3. system_admin creates first hospital administrator account
4. hospital_id is assigned to the administrator
5. administrator account is registered in:
   - auth.users
   - public.users
6. administrator receives access to hospital dashboard
7. administrator can invite additional users

---

# User Registration Flow

## Invite-Based Registration

1. admin creates invite code
2. user opens register page
3. user enters:
   - email
   - password
   - invite code
4. application validates invite code
5. Supabase Auth creates auth.users record
6. application inserts user profile into public.users
7. role and hospital_id are assigned
8. user account becomes active
9. user is redirected to dashboard

---

# Login Flow

1. user enters email and password
2. Supabase Auth validates credentials
3. session token is created
4. AuthContext stores authenticated user
5. application loads public.users profile
6. application verifies role and hospital access
7. dashboard page loads

---

# User Data Separation

## auth.users

Managed by Supabase Auth.

Responsible for:

- authentication
- email
- password
- session management
- token management

---

## public.users

Application user profile table.

Responsible for:

- role
- hospital_id
- display information
- application permissions
- profile information

---

# Hospital Access Structure

## system_admin

Can access:

- all hospitals
- platform administration pages
- system-level management features

---

## admin

Can access:

- own hospital only
- hospital management pages
- user invitation functions
- hospital settings

---

## user

Can access:

- assigned hospital only
- operational pages
- device-related functions

---

# System Admin Pages

## /admin

Dedicated system administrator dashboard.

Responsible for:

- hospital creation
- first admin creation
- platform management

---

## /api/admin/create-hospital

API route for hospital initialization.

Creates:

- hospital
- initial admin user
- hospital relationship data
- initial configuration

---

# AuthContext Responsibility

## AuthContext

Global authentication state manager.

Responsible for:

- authenticated user state
- session state
- login status
- logout handling
- user profile loading

---

# Future Expansion Possibilities

Potential future additions:

- password reset flow
- email verification
- session expiration handling
- audit logging
- approval workflow
- MFA (multi-factor authentication)
- advanced role permissions
- organization switching




招待コード
有効期限：7日
used=Trueで再利用不可
招待フロー
create_invite_code_transaction
↓
create_invite_code
↓
send_invite_mail
↓
/register?code=xxx
↓
register_user_transaction
↓
register_auth_user
↓
add_user
↓
used=True





emailを追加する。

display_name
email
role
hospital_name

emailはinvite_codeから取得し、frontから送らない。

登録成功後
registerUserTransaction
↓
setRegisteredUser
↓
RegisterCompleteModal
↓
ログイン画面へ


system admin
↓
email
display_name
hospital_name入力
↓
hospital作成
↓
invite_codes作成
(role=admin)
email保存
↓
登録URL付きメール送信
/register?code=xxx
↓
初回adminがpassword設定
↓
register_user_transaction
↓
auth.users作成
↓
public.users作成
↓
invite_code.used=True



## 認証デバッグ用テストページ

### 目的

Dashboardの業務ロジックを介さず、認証機能(authFetch・Refresh Token)だけを単独で検証する。

---

## テストページ

```
/test-auth
```

### 実装したボタン

* Token確認
* Access Token期限切れ(デバッグ用)
* Access Token削除
* authFetch実行

---

## 検証項目

### 1. 通常通信

```
authFetch実行
```

期待結果

```
200 OK
```

---

### 2. Access Token削除

```
Access Token削除
↓
authFetch実行
```

期待結果

```
401
↓
Refresh Token実行
↓
Access Token更新
↓
Retry
↓
200 OK
```

Dashboardでも同様の動作を確認済み。

---

### 検証結果

#### authFetch

* 通常通信：正常
* 401検知：正常
* Refresh Token実行：正常
* Access Token更新：正常
* Retry：正常

#### Dashboard

* restoreSession時：正常
* init-dashboard取得：正常
* CRUD実行中：正常
* Transaction実行中：正常

---

## 調査結果

以前発生した

```
invalid JWT:
token contains an invalid number of segments
```

は再現しなかった。

認証処理・Refresh処理・Retry処理はいずれも正常であることを確認した。

今後認証に問題が発生した場合は、まず `/test-auth` で認証基盤のみを検証してから Dashboard 側の問題かどうかを切り分ける。
