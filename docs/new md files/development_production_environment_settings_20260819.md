# 開発環境・本番環境の設定差分と認証関連設定

作成日: 2026-08-19
対象: medical-device-board

## 1. 環境構成

### 開発環境

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Backendの`.env`:

```env
APP_ENV=development
```

FrontendのAPI URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`localhost` と `127.0.0.1` を混在させない。今回、Frontendが`localhost:3000`、API URLが`127.0.0.1:8000`だった際に、Cookieが期待通り扱われず`/current-user`が401になる問題を確認した。

### 本番環境

- Frontend: `https://www.devix.jp/`
- Backend: `https://medical-device-board-api.onrender.com`
- Render Environment Variables:

```env
APP_ENV=production
```

FrontendのAPI URL:

```env
NEXT_PUBLIC_API_URL=https://medical-device-board-api.onrender.com
```

---

## 2. APP_ENVによる開発・本番判定

`APP_ENV`は自動判定されるものではない。各環境で値を設定する。

### 開発PC

```env
APP_ENV=development
```

### Render本番

RenderのEnvironment Variablesに以下を登録する。

```text
APP_ENV=production
```

既存コードが`APP_ENV`を参照していない状態で、Renderに環境変数を追加するだけなら既存コードの動作は変わらない。コード側で`os.getenv("APP_ENV")`等を利用した時点から意味を持つ。

### Backend側の読み込み

```python
import os
from dotenv import load_dotenv

load_dotenv()

APP_ENV = os.getenv("APP_ENV", "development")
```

未設定時は`development`扱いとする。

---

## 3. Session Cookie設定

Backendでは`session_id`をHttpOnly Cookieとして保持する。

### 開発環境

HTTPで動作するため、以下とする。

```python
if APP_ENV == "development":
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
    )
else:
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )
```

### 開発環境の理由

```text
Frontend: http://localhost:3000
Backend : http://localhost:8000
```

HTTPのlocalhost環境なので`secure=False`とする。

### 本番環境の理由

```text
Frontend: https://www.devix.jp
Backend : https://medical-device-board-api.onrender.com
```

HTTPSであるため`secure=True`とする。
また、FrontendとBackendが別サイトでCookieを使った認証を行うため、`SameSite=None`を使用する。
`SameSite=None`を利用する場合は`Secure`が必要。

---

## 4. CORS設定

現在のBackendでは、以下が設定されている。

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://devix.jp",
        "https://www.devix.jp",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

本番については`https://www.devix.jp`が既に許可されているため、追加設定は不要。

Credential付きCookie通信を行うため、`allow_credentials=True`を維持する。

---

## 5. FrontendのCookie送信

Cookie認証を使用するFrontendのfetchには、`credentials: "include"`を付ける。

### Login

```typescript
const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
        email,
        password,
    }),
})
```

### Current User

```typescript
const response = await fetch(`${API_BASE_URL}/current-user`, {
    credentials: "include",
})
```

### Refresh Token

`/refresh-token`もsession_id Cookieを使うため、`credentials: "include"`を付ける。

Logout等、Cookieを利用するAPIも同様。

---

## 6. Tokenの保持方針

### Browserに保存するもの

`session_id`はHttpOnly Cookieで保持する。

```text
HttpOnly Cookie
└─ session_id
```

Frontend JavaScriptから`session_id`を直接読み取らない。

### Access Token

Supabase Realtime認証に必要なため、FrontendのMemory上のStateに保持する。

```text
React State / AuthContext / Zustand等
└─ access_token
```

localStorage、sessionStorageには保存しない。

### Refresh Token

Frontendには保持しない。

Backend Sessionに保存する。

```text
Backend Session
├─ access_token
└─ refresh_token
```

Frontendからrefresh tokenを送信する方式にはしない。

---

## 7. Login / Current User / Refreshの役割

### Login

```text
Frontend
  ↓ email / password
Backend /login
  ↓
Supabase Auth
  ↓ access_token / refresh_token
Backend Session作成
  ↓
session_id発行
  ↓
HttpOnly Cookie
```

Login時にaccess tokenをFrontendへ渡す設計も可能だが、LoginとCurrent Userの両方で同じaccess tokenを返す必要はない。

今回の設計候補として、以下の構成を採用する。

```text
/login
  → current_userを返す
  → access_tokenは返さない

/current-user
  → current_userを返す
  → Realtime用access_tokenを返す
```

これにより、access tokenは`/current-user`で取得する。

### Reload

```text
Browser Reload
  ↓
GET /current-user
  ↓
HttpOnly Cookie: session_id
  ↓
Backend Session取得
  ↓
current_user + access_token
  ↓
Frontend State復元
```

これによりlocalStorageからtokenを復元しない。

### Refresh

```text
Frontend
  ↓ POST /refresh-token
  ↓ session_id Cookie
Backend
  ↓ Sessionからrefresh_token取得
Supabase Auth
  ↓ new access_token / new refresh_token
Backend Session更新
  ↓
Frontendへnew access_token
  ↓
React State更新
  ↓
supabase.realtime.setAuth(new_access_token)
```

Refresh後の新しいrefresh tokenはFrontendには渡さない。

---

## 8. Access TokenをFrontendに渡すことについて

RealtimeをFrontendから直接購読する構成では、Supabase Realtimeの認証にaccess tokenが必要となるため、Frontend Stateにaccess tokenを保持する設計を採用する。

これは「Frontendから完全に見えない」方式ではない。React State上のtokenはJavaScriptから参照可能であるため、XSS等への対策が必要。

一方、以下は禁止する。

- localStorageへのaccess token保存
- localStorageへのrefresh token保存
- sessionStorageへのtoken保存
- refresh tokenのFrontend保持
- Service Role KeyのFrontend保持

---

## 9. RenderのInstanceとSession Store

現在のBackend Session StoreはPythonプロセスのメモリ上にある。

```python
class SessionStore:
    def __init__(self):
        self._sessions: dict[str, BackendSession] = {}
```

この方式では、1 Instance内ではユーザーA・BのSessionは独立して管理される。

```text
SessionStore
├─ sessionA → User A
├─ sessionB → User B
└─ sessionC → User C
```

Sessionが混ざるわけではない。

### 複数Instanceになった場合

```text
Render
├─ Instance A
│   └─ SessionStore A
└─ Instance B
    └─ SessionStore B
```

Aで作成したSessionをBから取得できない可能性がある。

これは「同時利用ユーザーが何人だから必ず複数Instance」という固定ルールではない。RenderのScaling設定によって、手動スケーリングまたはAutoscalingを使用した場合に複数Instanceとなる。

### 現時点の判断

Backend再起動でSessionが消えること自体は、再Loginすればよいという運用方針で許容する。

したがって、現在の運用でAutoscalingを有効にせず1 Instance固定であれば、メモリ上のSession Storeを直ちにRedis等へ移行する必要性は低い。

将来複数Instance運用へ移行する場合は、全Instanceから共有できるSession Storeが必要になる。

候補:

- Supabase/PostgreSQLのsessionsテーブル
- Redis等の共有ストア

---

## 10. 本番移行前チェックリスト

### Environment

- [ ] Renderに`APP_ENV=production`を設定
- [ ] 開発`.env`に`APP_ENV=development`
- [ ] 本番Frontendの`NEXT_PUBLIC_API_URL`がBackendのHTTPS URLになっている
- [ ] 開発Frontendの`NEXT_PUBLIC_API_URL`が`http://localhost:8000`
- [ ] `localhost`と`127.0.0.1`を意図せず混在させない

### Cookie

- [ ] 開発: `secure=False`
- [ ] 開発: `samesite="lax"`
- [ ] 本番: `secure=True`
- [ ] 本番: `samesite="none"`
- [ ] `httponly=True`
- [ ] `path="/"`

### CORS

- [ ] `https://www.devix.jp`が`allow_origins`に含まれている
- [ ] `allow_credentials=True`
- [ ] `allow_origins=["*"]`にしない

### Frontend

- [ ] Loginに`credentials: "include"`
- [ ] `/current-user`に`credentials: "include"`
- [ ] `/refresh-token`に`credentials: "include"`
- [ ] Cookie利用APIに同様の設定がある
- [ ] localStorageにaccess tokenを保存しない
- [ ] localStorageにrefresh tokenを保存しない
- [ ] sessionStorageにtokenを保存しない

### 本番ブラウザ確認

- [ ] `/login` Responseに`Set-Cookie: session_id=...`がある
- [ ] Cookieが`HttpOnly`になっている
- [ ] Cookieが`Secure`になっている
- [ ] Cookieが`SameSite=None`になっている
- [ ] `/current-user` Requestに`Cookie: session_id=...`がある
- [ ] `/current-user`が200を返す
- [ ] Reload後もcurrent userを復元できる
- [ ] Refresh後に新access tokenでRealtimeが継続する

---

## 11. 現在の設計上の重要ポイント

今回の認証方式は、以下を基本方針とする。

```text
通常API
Frontend
  ↓ Cookie: session_id
Backend Session
  ↓
Supabase DB

Realtime
Frontend
  ↓ access_token (Memory State)
Supabase Realtime
```

つまり、通常APIの認証にaccess tokenをFrontendから送信する方式にはせず、session_id Cookie + Backend Sessionを利用する。

Access tokenをFrontendへ保持するのはRealtime認証のための例外とする。

---

## 12. 今回のPC2で確認された事象

開発時に以下の構成でCookie問題が発生した。

```text
Frontend: http://localhost:3000
API URL : http://127.0.0.1:8000
```

`/login` Responseには`Set-Cookie: session_id=...`が存在したが、`/current-user`へCookieが送信されず`401 Session not found`となった。

FrontendのAPI URLを、

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

に変更してホスト名を統一したところLoginが正常に動作した。

このため、開発時もFrontendとBackendのホスト名を意図的に統一する。

---

## 13. 今後の確認事項

本番マージ前に確認する優先順位:

1. Cookie設定（development / productionの分岐）
2. Render `APP_ENV=production`
3. 本番ブラウザでCookie保存・送信を確認
4. access token / refresh tokenがlocalStorage等に残っていないことを確認
5. Refresh後のRealtime認証継続を確認
6. RenderのScaling設定を確認し、複数Instance運用の有無を把握
7. 複数Instanceへ移行する場合のみ共有Session Storeを再検討
