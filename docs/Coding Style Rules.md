# Coding Style Rules

## 単純な処理は1行で書く

### OK

```ts
const token = localStorage.getItem("access_token")
```

### NG

```ts
const token =
  localStorage.getItem(
    "access_token"
  )
```

---

## 複数要素を持つobject・type・引数は縦位置を揃える

### OK

```ts
type AddDeviceParams = {
                        type: number
                        model: number
                        }
```

### NG

```ts
type AddDeviceParams = {

  type: number
  model: number

}
```

---

## 無意味な空行を入れない

コードの高さを増やさず、
情報密度を保つ。

# Debug Output Rules

## 単一値は1行で表示する
NG
      type:
        selectedTypeID,
OK
      type:selectedTypeID,

### Python

```python
print(f"user_id: {user_id}")
```

### TypeScript

```ts
console.log(`userId: ${userId}`)
```

---

## list・dict・objectは箇条書きで表示する

### list

```python
print("device_list")

for device in device_list:
    print(f"・{device}")
```

### dict

```python
print("current_user")

for key, value in current_user.items():
    print(f"・{key}: {value}")
```

---

## object/listをそのままdumpしない

### NG

```python
print(device_list)
print(current_user)
```

### OK

```python
print("device_list")

for device in device_list:
    print(f"・{device}")
```
## 汎用性の高いDB操作系関数と専用性の高いTransaction関数に分ける
transacion関数はDB操作系関数を用いて構築すること

## frontendはUIで取得した情報をbackendに送る、backendから受け取った情報を表示するだけ

## ネスト構造はインデントで明確にする

### OK

```ts
const response = await fetch(
    `${API_BASE_URL}/create-device-transaction`,
    {
        method: "POST",

        headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                  },

        body: JSON.stringify({
                                type:params.type,
                                model:params.model
                              })
    }
)

OK

type CreateDeviceTransactionParams = {
                                      type: Device["type"]
                                      model: Device["model"]
                                      assetType: Device["assetType"]
                                    }

関数作成する際はprintなどは最小限にし、エラーハンドルも最小限にし
関数の骨子が分かりやすい構造にする。

1行でかけるパラメータは改行しないこと
無駄な段落を開けないこと
NG
type:
   Device["type"]

model:
   Device["model"]

OK
type: Device["type"]
model: Device["model"]