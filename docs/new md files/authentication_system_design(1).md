# 認証システム設計

## 1. 基本方針

本システムの認証・認可は、**Backend Sessionを中心**として管理する。

原則として、Supabaseのtoken情報はBackendが保持し、Frontendは`session_id`を用いてBackend
Sessionに紐づく情報を利用する。


### 基本方針

-   原則としてtoken情報はBackendが保持する
-   Login時にSupabaseのtoken情報をBackend Sessionへ保存する
-   一般的なBackend API操作ではBackend Session情報を利用する
-   `session_id`はHttpOnly CookieでFrontendへ保持させる
-   Frontendは`session_id`を直接読み取らず、Cookieを`credentials: "include"`でBackendへ送る
-   FrontendはBackend APIから必要なSession由来情報を取得する
-   `refresh_token`はBackend Sessionでのみ管理する
-   system_adminによる管理操作は、Backend内部のService Role
    Keyを使用したAdmin Clientで実行する
-   Service Role KeyはFrontendへ絶対に渡さない

------------------------------------------------------------------------

# 2. 認証情報の管理場所

## Backend Session

Backend Sessionには、ログインユーザーに紐づく以下の情報を保存する。

``` text
session_id
user_id
hospital_id
hospital_name
role
email
display_name
access_token
refresh_token
client
```

`BackendSession`では以下の構造を使用する。

``` python
class BackendSession(BaseModel):
    user_id: str
    hospital_id: str
    hospital_name: str
    role: str
    email: str
    display_name: str
    access_token: str
    refresh_token: str
    client: Client
```


保存場所はReact State / AuthContextとし、Local Storageには保存しない。

Frontendには`refresh_token`を保持させない。

------------------------------------------------------------------------

# 3. session_id Cookie

FrontendとBackendのSessionを紐づけるため、`session_id`をHttpOnly
Cookieとして保持する。

``` text
Browser
  │
  │ HttpOnly Cookie
  │ session_id
  ▼
Backend
  │
  ▼
Backend Session Store
```

Frontend JavaScriptから`session_id`を直接取得することはしない。

Backend APIを呼び出す際は、

``` ts
fetch(url, {
  credentials: "include",
})
```

としてCookieを送信する。

------------------------------------------------------------------------

# 4. Login

Login時は以下の流れとする。

``` text
Frontend
  │
  │ email / password
  ▼
Backend /login
  │
  ▼
Supabase Auth
  │
  ├─ access_token
  └─ refresh_token
  │
  ▼
Backend Session作成
  │
  ├─ user_id
  ├─ hospital_id
  ├─ hospital_name
  ├─ role
  ├─ email
  ├─ display_name
  ├─ access_token
  ├─ refresh_token
  └─ client
  │
  ▼
session_id発行
  │
  ▼
HttpOnly Cookie
```


------------------------------------------------------------------------

# 5. Reload

ブラウザReload時、FrontendはLocal Storageからtokenを復元しない。

代わりに、HttpOnly Cookieの`session_id`を利用してBackendへ問い合わせる。

``` text
Browser
  │
  │ session_id Cookie
  ▼
GET /current-user
  │
  ▼
Backend
  │
  ▼
get_current_session()
  │
  ▼
Backend Session
  │
  ├─ user information
  └─ access_token
  │
  ▼
Frontend
  │
  ├─ currentUser → State
```


------------------------------------------------------------------------

# 6. Refresh Token

Refresh TokenはFrontendでは保持せず、Backend
Sessionに保存されているものを使用する。

``` text
Frontend
  │
  │ POST /refresh-token
  │ session_id Cookie
  ▼
Backend
  │
  ▼
Backend Session
  │
  └─ refresh_token
  │
  ▼
Supabase Auth
  │
  ├─ new access_token
  └─ new refresh_token
  │
  ▼
Backend Session更新
  │
  ├─ access_token更新
  └─ refresh_token更新
  │
  ▼
Frontend
  │
  └─ new access_token → State
```

Refresh後、FrontendのStateに保存されている`access_token`を更新する。

`refresh_token`はFrontendへ渡さない。

------------------------------------------------------------------------

# 10. System Admin

system_adminによる管理操作では、通常ユーザーの`session.client`を使用しない。

Backendで現在のSessionを確認し、

``` text
session.role == "system_admin"
```

であることをBackend側で確認したうえで、Service Role Keyを使用したAdmin
Clientを利用する。

``` text
Frontend
  │
  │ session_id Cookie
  ▼
Backend
  │
  ├─ get_current_session()
  │
  ├─ role確認
  │
  └─ system_admin ?
       │
       ├─ No → 403
       │
       └─ Yes
            ↓
       get_admin_client()
            ↓
       Supabase Service Role
            ↓
       DB operation
```

Admin ClientはBackend内部でのみ生成・保持する。

Service Role Keyは以下の場所には存在させない。

-   Frontend
-   Browser State
-   Local Storage
-   Session Storage
-   Client-side environment variable

------------------------------------------------------------------------

# 11. 一般ユーザー操作とSystem Admin操作の違い

## 一般ユーザー

``` text
session_id Cookie
      ↓
Backend Session
      ↓
session.client
      ↓
Supabase
      ↓
RLS
```

一般ユーザーのDB操作は、Supabase RLSによる権限制御を利用する。

## system_admin

``` text
session_id Cookie
      ↓
Backend Session
      ↓
Backendでrole確認
      ↓
get_admin_client()
      ↓
Service Role
      ↓
Supabase
```

system_adminの管理操作は、Backendで明示的に権限確認を行った後、Admin
Clientで実行する。

------------------------------------------------------------------------

# 12. 認証システム全体像

``` text
                         ┌─────────────────────┐
                         │       Browser       │
                         │                     │
                         │ HttpOnly Cookie     │
                         │ session_id          │
                         │                     │
                         │ AuthContext State   │
                         │ access_token        │
                         └──────────┬──────────┘
                                    │
                  credentials: include
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       FastAPI       │
                         │                     │
                         │ get_current_session │
                         │         │           │
                         │         ▼           │
                         │ Backend Session     │
                         │                     │
                         │ access_token        │
                         │ refresh_token       │
                         │ user information    │
                         └──────┬──────────────┘
                                │
               ┌────────────────┴────────────────┐
               │                                 │
               ▼                                 ▼
      一般ユーザー操作                    system_admin操作
               │                                 │
       session.client                    get_admin_client()
               │                                 │
               ▼                                 ▼
          Supabase                           Supabase
               │                                 │
              RLS                         Service Role
               │                                 │
               └────────────────┬────────────────┘
                                │
                                ▼
                              DB



Browser
  │
  │ access_token
  ▼
  │
  │ postgres_changes
  ▼
Browser State
  │
  ▼
UI
```

------------------------------------------------------------------------

# 13. Token保存方針まとめ

  ------------------------------------------------------------------------------------
  情報                   Backend          Frontend State  Local Storage       HttpOnly
                         Session                                                Cookie
  --------------- -------------- ----------------------- -------------- --------------
  session_id                   ○                       ×              ×              ○

  access_token                 ○                       ○              ×              ×

  refresh_token                ○                       ×              ×              ×

  user_id                      ○   currentUserとして保持              ×              ×

  hospital_id                  ○   currentUserとして保持              ×              ×

  hospital_name                ○   currentUserとして保持              ×              ×

  role                         ○   currentUserとして保持              ×              ×

  email                        ○   currentUserとして保持              ×              ×

  display_name                 ○   currentUserとして保持              ×              ×

  Service Role       Backendのみ                       ×              ×              ×
  Key                                                                   
  ------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 14. 現在の設計上の重要事項

### Backendを認証情報の中心とする

FrontendはSupabase AuthのSessionを直接管理しない。

### Refresh TokenはBackendのみ

Refresh TokenはBackend Sessionにのみ保持する。


### Local Storageにはtokenを保存しない

Access Token、Refresh TokenともにLocal Storageには保存しない。

### system_adminの管理操作はAdmin Client

Service Role Keyを使用するAdmin ClientはBackend内部のみで利用する。


