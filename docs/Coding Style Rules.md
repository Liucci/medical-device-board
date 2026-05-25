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