# Debug Guide

## Purpose

本ドキュメントは、本システムのデバッグ方針を定義する。

開発時は本書のルールに従う。

---

# Debug Philosophy

目的は

```
原因特定
```

であり、

大量ログ出力ではない。

---

# Logging Rule

大量出力は禁止。

---

## list

NG

```
print(rows)
```

OK

```
print(rows[:5])
```

---

## list(dict)

代表1件のみ

```
for k,v in rows[0].items():
    print(k,v)
```

---

## JSON

```
console.log(rows[0])
```

---

# Exception Rule

NG

```python
except Exception:
    return None
```

OK

```python
except Exception as e:
    print(e)
    raise
```

---

# Frontend Debug

確認順

```
State

↓

Mapper

↓

Fetch

↓

API

↓

Backend
```

---

# Backend Debug

確認順

```
Route

↓

Transaction

↓

CRUD

↓

Supabase
```

---

# Auth Debug

確認

```
Access Token

Refresh Token

currentUser

Authorization Header
```

---

# Refresh Debug

正常系

```
401

↓

Refresh

↓

Retry

↓

200
```

確認する。

---

# Dashboard Debug

確認順

```
fetch_init_dashboard

↓

normalize

↓

State

↓

UI
```

---

# Realtime Debug

確認

```
DB更新

↓

Realtime通知

↓

API再取得

↓

State更新
```

---

# PDF Debug

確認

```
Font

↓

Layout

↓

Footer

↓

Export
```

---

# CSV Debug

確認

```
Mapper

↓

CSV生成

↓

Download
```

---

# Render Debug

確認

```
Build Log

↓

Runtime Log
```

---

# Supabase Debug

確認

```
RLS

hospital_id

JWT

Policy
```

---

# CORS Debug

CORSではなく

500エラーの場合がある。

必ずBackendログを見る。

---

# useSearchParams

直接使用しない。

Server Component経由で渡す。

---

# Device Movement

確認順

```
Transaction

↓

History

↓

Task

↓

Realtime

↓

UI
```

---

# Debug Priority

1. Backend Error

↓

2. API Response

↓

3. Mapper

↓

4. State

↓

5. UI

---

# Goal

最小限のログで、

最短時間で原因を特定できるデバッグ手順を維持する。