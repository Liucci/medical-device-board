# Refresh Token 調査ログ（2026-06-26）

## 現状

認証フローは以下の構成。

Frontend
↓
loginTransaction
↓
FastAPI
↓
Supabase

TokenはフロントでlocalStorage管理。

- access_token
- refresh_token

refreshは

authFetch()
↓
401
↓
refreshToken()
↓
FastAPI /refresh-token
↓
supabase.auth.refresh_session()

という流れ。

---

# authFetch

authFetchは401を検知するとrefreshToken()を実行する。

refreshPromiseで同時Refreshを防止。

```ts
let refreshPromise: Promise<boolean> | null = null

if (!refreshPromise) {
    refreshPromise = refreshToken()
        .finally(() => refreshPromise = null)
}

const refreshed = await refreshPromise

if (!refreshed) {
    throw new Error("ログイン期限切れ")
}
```

設計として問題なし。

refreshPromiseは

- null = Refresh未実行
- Promise<boolean> = Refresh実行中

という状態管理であり、booleanを保持している訳ではない。

---

# refreshToken()

修正済み。

以前

```ts
return data
```

だったため

401でもtruthyとなる可能性があった。

現在は

```ts
return true
```

または

```ts
return false
```

へ修正。

戻り値は

Promise<boolean>

で統一。

response.okも確認するよう修正。

---

# fetchCurrentUser()

戻り値は

Promise<User | null>

booleanには変更しない。

理由

この関数は

「Userを取得する」

責務であるため。

---

# loginTransaction

ログイン後

```ts
localStorage.setItem("access_token", loginResponse.access_token)

localStorage.setItem("refresh_token", loginResponse.refresh_token)
```

を実施している。

ログイン時の保存処理は問題なし。

---

# refresh-token API

Backend

```python
response = supabase.auth.refresh_session(refresh_token)

return response
```

余計な処理はしていない。

---

# 発生している問題

数時間後

```
GET /current-user
401

↓

POST /refresh-token

↓

Invalid Refresh Token: Already Used
```

となる。

その後

```
received refresh token
同じtoken
```

が送られ続ける。

---

# 判明したこと

console.trace()で調査。

refreshToken()は

```
restoreSession()

↓

fetchCurrentUser()

↓

authFetch()

↓

refreshToken()
```

から呼ばれている。

少なくとも今回のログでは

AuthContextが呼び出し元。

---

# まだ不明な点

なぜ

Already Used

になるのか。

候補

① 同じRefreshTokenを別セッションが先に使っている

- 複数タブ
- 別ブラウザ
- 別端末
- localhostと本番

など。

② Refresh成功後に新しいRefreshTokenへ更新されていない

まだ未確認。

---

# デバッグ方針

ログイン時

```
[LOGIN REFRESH]
```

Refresh成功時

```
[NEW REFRESH]
```

保存後

```
[LOCAL REFRESH]
```

を出力し、

RefreshTokenが

A

↓

B

へ更新されているか確認する。

---

# 確認事項

- Refresh成功時に新しいrefresh_tokenは返却されているか
- localStorageへ即時保存されているか
- 保存後に別箇所で上書きされていないか
- 同一ユーザーで複数セッションが存在していないか

---

# 設計メモ

責務ごとの戻り値

refreshToken()
→ Promise<boolean>

authFetch()
→ Promise<Response>

fetchCurrentUser()
→ Promise<User | null>

役割が異なるため戻り値が異なるのは正常。

---

# 今後の優先順位

1. Refresh成功時のtoken更新ログ確認
2. Already Used発生時の原因調査
3. 発生原因特定後に再発防止実装


# Authentication Flow

## 概要

認証処理の構成

Frontend
↓
FastAPI
↓
Supabase

...

---

# Login Flow

...

---

# authFetch

...

---

# Refresh Token

...

---

# Refresh Promise

...

---

# fetchCurrentUser

...

---

# restoreSession

...

---

# Authentication Test Page

## 目的

Dashboardを介さず、認証基盤のみを検証する。

URL

```
/test-auth
```

### 実装したボタン

- Token確認
- Access Token期限切れ
- Access Token削除
- authFetch実行

### 検証内容

#### 通常通信

期待

```
200 OK
```

#### Access Token削除

期待

```
401

↓

Refresh Token

↓

Retry

↓

200 OK
```

#### Dashboard

- restoreSession
- init-dashboard
- CRUD
- Transaction

全てRefresh動作を確認。

---

# Authentication Debug

## 調査内容

### authFetch

- refreshPromise導入
- Promise<boolean>へ変更

### refreshToken

return data

↓

return true / false

へ修正。

response.ok追加。

### fetchCurrentUser

Promise<User | null>

のままとする。

---

# 調査中

## Refresh Token Already Used

### 発生ログ

```
GET /current-user

↓

401

↓

POST /refresh-token

↓

Invalid Refresh Token: Already Used
```

### 判明したこと

console.traceより

restoreSession

↓

fetchCurrentUser

↓

authFetch

↓

refreshToken

から呼ばれている。

### 未解決

- なぜAlready Usedになるか
- Refresh成功後にtoken更新されているか
- 複数セッションの影響有無

---

# 今後の調査

- Refresh成功時のtokenログ
- localStorage更新確認
- 新旧RefreshToken比較
- 複数セッション確認

# Auth Refresh Token 調査ログ（2026-06-26）

## 概要

Access Token の有効期限切れ後に、

```
Invalid Refresh Token: Already Used
```

が発生し、Refresh Token による再認証が失敗する問題を調査した。

---

# 調査方法

Supabase Dashboard の

```
JWT Settings
Access token expiry time
```

を **10秒** に設定し、強制的に期限切れを発生させた。

また、Dashboard の影響を排除するため、

```
/test-auth
```

ページを作成し、認証処理のみを検証した。

その結果、

Dashboard固有の問題ではなく、
認証処理自体で問題が発生していることを確認した。

---

# 調査結果

## ① Frontend の問題ではなかった

以下を疑った。

- authFetch
- 複数useEffect
- 複数API同時実行
- Dashboard
- Zustand
- localStorage保存

しかし test-auth ページでも同じ現象が発生したため、
これらは原因ではないと判断した。

---

## ② Refresh Token の受け渡し

ログイン時

```
login refresh token
mos7ikom556z
```

Refresh時

```
received refresh token
mos7ikom556z
```

完全一致。

つまり

- login
- localStorage保存
- authFetch

で別Tokenへ変化していないことを確認。

---

## ③ 問題箇所

Backend

```python
response = supabase.auth.refresh_session(refresh_token)
```

実行時に

```
AuthApiError

Invalid Refresh Token: Already Used
```

が発生。

Routeには到達しており、

```
received refresh token
```

まで表示されるが、

```
new refresh token
```

は表示されなかった。

つまり

```
refresh_session()
```

内部で例外が発生していた。

---

## ④ 原因

Supabase Client

```python
supabase = create_client(url, key)
```

では

Client内部の

```
auto_refresh_token
```

が有効になっていた。

そのため、

ライブラリ内部でRefresh Tokenが先に消費され、

その後

```python
supabase.auth.refresh_session(...)
```

を実行すると

```
Already Used
```

となっていた。

---

# 修正内容

Supabase Client生成時に

```python
options = ClientOptions(
    auto_refresh_token=False
)

supabase = create_client(
    url,
    key,
    options
)
```

へ変更。

---

# 修正後ログ

1回目

```
received refresh token
mos7ikom556z

↓

refresh_session success

↓

new refresh token
re7ihtt2qpmj
```

2回目

```
received refresh token
re7ihtt2qpmj

↓

refresh_session success

↓

new refresh token
f5pbjs736kmj
```

Refresh Token が毎回更新され、

401 → Refresh → 再取得

の流れが正常に動作することを確認。

---

# 結論

BackendでRefresh Tokenを明示的に管理する構成では、

```
auto_refresh_token=False
```

に設定する。

自動Refreshを有効にすると、

Supabase Client内部とアプリ側で

Refresh Tokenの二重利用が発生し、

```
Invalid Refresh Token: Already Used
```

となる可能性がある。

本システムでは、

FastAPIが唯一のRefresh管理者となるため、

Client側の自動Refreshは無効化する。