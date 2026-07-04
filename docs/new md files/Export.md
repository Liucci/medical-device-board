# Export

## Purpose

本ドキュメントは、本システムのCSV・PDF出力仕様を定義する。

対象

- Device List
- Device History

出力形式

- CSV
- PDF

---

# Export Architecture

```
UI

↓

Transaction

↓

Backend Route

↓

Export Transaction

↓

PDF / CSV Generator
```

Exportは通常のCRUDとは独立した責務を持つ。

---

# Export Types

対応帳票

```
Device List CSV

Device List PDF

History CSV

History PDF
```

---

# Device List Export

出力内容

- 管理番号
- シリアル番号
- 機種
- 型式
- 資産区分
- 配置場所
- 状態
- 備考

---

# History Export

出力内容

- 実施日時
- 機種
- 型式
- 操作内容
- 配置場所
- 患者名
- メッセージ

HistoryはSnapshotを出力する。

---

# Export Flow

```
HistoryModal

↓

filteredHistories

↓

ExportTransaction

↓

Mapper

↓

Backend

↓

PDF / CSV
```

---

# History PDF

Route

```
POST /export-history-pdf
```

Request

```
HistoryExportRow[]
```

---

# History CSV

Route

```
POST /export-history-csv
```

---

# Device List PDF

Route

```
POST /export-device-list-pdf
```

---

# Device List CSV

Route

```
POST /export-device-list-csv
```

---

# HistoryExportRow

```
createdAt

deviceTypeName

deviceModelName

actionType

roomName

stockAreaName

patientName

message
```

MapperでBackend形式へ変換する。

---

# PDF Layout

サイズ

```
A4 Landscape
```

横向き固定。

---

# Font

```
NotoSansJP-Regular

NotoSansJP-Bold
```

ReportLabへ登録する。

---

# Table

```
repeatRows=1
```

全ページでヘッダーを表示する。

---

# Date Format

日時

```
YYYY/MM/DD

HH:mm
```

2行表示とする。

---

# Footer

全ページ共通

左

```
Hospital Name
```

中央

```
Export DateTime
```

右

```
Page Number
```

---

# CSV Rule

文字コード

```
UTF-8
```

Excelで開ける形式を採用する。

---

# Export Responsibility

Frontend

- 対象データ選択
- Export Transaction

Backend

- PDF生成
- CSV生成
- レイアウト
- フォーマット

---

# ReportLab Rule

共通処理

```
create_pdf_doc()
```

を利用する。

各帳票で共通化する。

---

# Layout Rule

列幅は

```
colWidths
```

で管理する。

文字数に応じて調整する。

---

# Export Policy

帳票は

Snapshot

を利用する。

現在のマスタ名称へ変換しない。

---

# Future Expansion

追加予定帳票

- Maintenance Task List
- Infection List
- User List
- Ward List
- Device Utilization Report
- Rental Device Report

追加時も同一Architectureを採用する。

---

# Goal

本ドキュメントのみで

- CSV仕様
- PDF仕様
- レイアウト
- Export構造
- ReportLab構成

を理解できる状態を維持する。