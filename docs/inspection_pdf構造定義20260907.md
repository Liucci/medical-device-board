# Inspection PDF化構造

```text
Frontend
  ↓ inspection_id
Backend
  ↓
DB取得
  ↓
PDF用データ加工
  ↓
PDF生成
  ↓
PDF Response
  ↓
Frontendでダウンロード
```

- Frontendは `inspection_id` のみ送信
- DB取得・加工・PDF生成はBackend
- Frontendはダウンロードのみ
