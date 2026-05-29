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


# Simple Coding Rules

## とにかくシンプルに書く

コードの骨子が一目で分かる構造を最優先にする。

不要な装飾、
不要な抽象化、
不要なwrapperを作らない。

---

## 処理の流れが上から読める構造にする

関数を読んだ時、
何をしているか即座に理解できるようにする。

### OK

```ts id="63d20e"
const data =
  await response.json()

setDeviceList(data)

onClose()
```

### NG

```ts id="6s0m7x"
handleSuccessResponse(
  transformResponse(
    validateResponse(data)
  )
)
```

---

## 過剰なエラーハンドルを書かない

必要最小限だけ。

### NG

```ts id="h4gh39"
try {

  if (!data.success) {

    if (data.error) {

      console.error(data.error)

    } else {

      console.error("unknown error")
    }
  }

} catch(err) {

  console.error(err)
}
```

### OK

```ts id="4ewt7f"
const data =
  await response.json()

setDeviceList(data)
```

---

## success wrapperを作らない

指定が無ければ直接return。

### OK

```python id="qk79xz"
return response.data
```

### NG

```python id="4gpk1m"
return {
  "success":True,
  "data":response.data
}
```

---

## backendはlistをそのまま返す

過剰なJSON構造を作らない。

### OK

```json id="7gw53m"
[
  {
    "id":1,
    "name":"ECMO"
  }
]
```

### NG

```json id="1zqjha"
{
  "success":true,
  "devices":[
    {
      "id":1,
      "name":"ECMO"
    }
  ]
}
```

---

## debugは必要時のみ

恒常的なconsole.logを残さない。

### OK

```ts id="bjk5df"
console.log(data)
```

### NG

```ts id="sh3r5w"
console.log(
  "fetch devices response",
  data
)

console.log(
  "normalized devices",
  normalized
)

console.log(
  "device count",
  normalized.length
)
```

---

## frontendは表示とstate更新だけに集中する

frontendで複雑な変換や業務ロジックを書かない。

---

## transaction関数は骨子を見せる

何をしているかを明確にする。

### OK

```ts id="yoa9um"
await createDeviceTransaction(params)

await getDevicesFromApi(
  setDeviceList
)

onClose()
```

---

## 無意味な抽象化をしない

1回しか使わない処理をwrapper関数化しない。

---

## 深いネストを避ける

returnで早期終了する。

### OK

```ts id="ykvc8n"
if (!token) {return}

const data =
  await response.json()
```

### NG

```ts id="h1y6l2"
if (token) {

  if (response) {

    if (data) {

    }
  }
}
```
